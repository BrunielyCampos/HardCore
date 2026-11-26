package com.hardcore.pedidos.abacatepayapi.service;

import tools.jackson.databind.JsonNode;
import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
import com.hardcore.pedidos.integracao.ProdutoClient;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.mapper.PedidoMapper;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.model.EstadoPagamentoEnum;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.model.TipoPagamentoEnum;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class PagamentoService {
    private final AbacatePayService abacatePayService;
    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;
    private final ProdutoClient produtoClient;
    private final ItemPedidoRepository itemPedidoRepository;

    @Value("${abacatepay.webhook.secret}")
    private String webhookSecret;
    @Value("${abacatepay.webhook.endpoint:}")
    private String webhookEndpoint;

    @Transactional
    public PedidoResponseDTO criarCheckout(CriarCheckoutDTO dto) {
        Pedido pedido = buscarPedido(dto.pedidoId());
        validarAcessoAoPedido(pedido);
        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Só é possível criar checkout para pagamento pendente.");
        }
        if (pedido.getAbacatePayCheckoutId() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este pedido já possui um checkout.");
        }

        List<Map<String, Object>> itensCheckout = new ArrayList<>();
        List<ItemPedido> itensPedido = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var item : dto.itens()) {
            Long produtoId;
            try {
                produtoId = Long.valueOf(item.id());
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O campo id de cada item deve ser o ID numérico do produto no microsserviço Produtos.");
            }

            JsonNode produto = produtoClient.buscarPorId(produtoId);
            if (produto == null || produto.path("id").isMissingNode()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado: " + produtoId);
            }
            String nome = produto.path("nome").asString("Produto " + produtoId);
            BigDecimal preco = BigDecimal.valueOf(produto.path("preco").asDouble());
            if (preco.signum() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto sem preço válido: " + produtoId);
            }
            int precoCentavos;
            try {
                precoCentavos = preco.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).intValueExact();
            } catch (ArithmeticException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preço do produto fora do limite aceito.");
            }

            String externalId = "hardcore-produto-" + produtoId + "-" + precoCentavos;
            JsonNode respostaProduto = abacatePayService.buscarProdutoPorExternalId(externalId);
            JsonNode dadosProduto = respostaProduto == null ? null : validarResposta(respostaProduto);
            if (dadosProduto == null || dadosProduto.path("id").asString(null) == null) {
                dadosProduto = validarResposta(abacatePayService.criarProduto(externalId, nome, precoCentavos));
            }
            String idProdutoAbacate = dadosProduto.path("id").asString(null);
            if (idProdutoAbacate == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AbacatePay não retornou o ID do produto cadastrado.");
            }

            itensCheckout.add(Map.of("id", idProdutoAbacate, "quantity", item.quantity()));
            itensPedido.add(new ItemPedido(null, pedido.getId(), pedido, produtoId, item.quantity(), preco.doubleValue()));
            total = total.add(preco.multiply(BigDecimal.valueOf(item.quantity())));
        }

        if (total.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor total do pedido deve ser maior que zero.");
        }

        pedido.setValorCompra(total.setScale(2, RoundingMode.HALF_UP).doubleValue());
        List<ItemPedido> reservasAplicadas = new ArrayList<>();
        String checkoutIdCriado = null;
        try {
            for (ItemPedido item : itensPedido) {
                produtoClient.reservarEstoque(item.getIdProduto(), item.getQuantidade());
                reservasAplicadas.add(item);
            }

            pedido.setEstoqueBaixado(true);
            pedidoRepository.save(pedido);
            itemPedidoRepository.deleteAll(itemPedidoRepository.findByIdPedido(pedido.getId()));
            itemPedidoRepository.saveAll(itensPedido);

            String externalIdPedido = "pedido-" + pedido.getId() + "-" + System.currentTimeMillis();
            List<String> methods = pedido.getTipoPagamento() == TipoPagamentoEnum.PIX
                    ? List.of("PIX") : List.of("CARD");
            JsonNode data = validarResposta(abacatePayService.criarCheckout(itensCheckout, externalIdPedido, methods));
            checkoutIdCriado = data.path("id").asString(null);
            String url = data.path("url").asString(null);
            if (checkoutIdCriado == null || url == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "A AbacatePay não retornou o ID e a URL do checkout.");
            }
            pedido.setAbacatePayCheckoutId(checkoutIdCriado);
            pedido.setUrlPagamento(url);
            pedidoRepository.save(pedido);
            return pedidoMapper.toDTO(pedido);
        } catch (RuntimeException erro) {
            if (checkoutIdCriado != null) {
                try { abacatePayService.cancelarCheckout(checkoutIdCriado); } catch (RuntimeException ignored) { }
            }
            for (ItemPedido item : reservasAplicadas) {
                try { produtoClient.liberarEstoque(item.getIdProduto(), item.getQuantidade()); }
                catch (RuntimeException falhaLiberacao) { erro.addSuppressed(falhaLiberacao); }
            }
            pedido.setEstoqueBaixado(false);
            throw erro;
        }
    }

    public JsonNode consultarCheckoutDoPedido(Long pedidoId) {
        Pedido pedido = buscarPedido(pedidoId);
        validarAcessoAoPedido(pedido);
        if (pedido.getAbacatePayCheckoutId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "O pedido ainda não possui checkout.");
        }
        return abacatePayService.consultarCheckout(pedido.getAbacatePayCheckoutId());
    }

    @Transactional
    public PedidoResponseDTO solicitarCancelamentoOuReembolso(Long pedidoId, String motivo) {
        Pedido pedido = buscarPedido(pedidoId);
        validarAcessoAoPedido(pedido);

        if (pedido.getEstado() == EstadoCompraEnum.COMPRA_CANCELADA
                || pedido.getEstadoPagamento() == EstadoPagamentoEnum.ESTORNADO
                || pedido.getEstadoPagamento() == EstadoPagamentoEnum.CANCELADO) {
            return pedidoMapper.toDTO(pedido);
        }

        if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.EM_DISPUTA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Pedido em disputa não pode ser cancelado automaticamente."
            );
        }

        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.PAGO) {
            if (pedido.getAbacatePayCheckoutId() != null) {
                try {
                    validarResposta(abacatePayService.cancelarCheckout(pedido.getAbacatePayCheckoutId()));
                } catch (HttpClientErrorException | ResponseStatusException ignored) {
                }
            }
            pedido.setEstadoPagamento(EstadoPagamentoEnum.CANCELADO);
            liberarEstoque(pedido);
            pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
            pedidoRepository.save(pedido);
            return pedidoMapper.toDTO(pedido);
        }

        pedido.setEstado(EstadoCompraEnum.CANCELAMENTO_SOLICITADO);
        pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO confirmarReembolso(Long pedidoId, String motivo) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        boolean gerenteOuAdmin = autenticacao != null && autenticacao.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GERENTE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!gerenteOuAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas gerente ou admin pode confirmar reembolso.");
        }

        Pedido pedido = buscarPedido(pedidoId);
        validarAcessoAoPedido(pedido);

        if (pedido.getEstado() == EstadoCompraEnum.COMPRA_CANCELADA
                && pedido.getEstadoPagamento() == EstadoPagamentoEnum.ESTORNADO) {
            return pedidoMapper.toDTO(pedido);
        }

        String motivoFinal = (motivo != null && !motivo.isBlank())
                ? motivo
                : "Reembolso confirmado pelo gerenciador para o pedido " + pedidoId;

        if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.PAGO
                || pedido.getEstadoPagamento() == EstadoPagamentoEnum.ESTORNADO) {
            return estornarPagamento(pedidoId, motivoFinal);
        }

        if (pedido.getAbacatePayCheckoutId() != null
                && pedido.getEstadoPagamento() != EstadoPagamentoEnum.CANCELADO) {
            try {
                validarResposta(abacatePayService.cancelarCheckout(pedido.getAbacatePayCheckoutId()));
            } catch (HttpClientErrorException | ResponseStatusException ignored) {
            }
        }

        pedido.setEstadoPagamento(EstadoPagamentoEnum.CANCELADO);
        liberarEstoque(pedido);
        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO cancelarPagamento(Long pedidoId) {
        return solicitarCancelamentoOuReembolso(pedidoId, null);
    }

    @Transactional
    public PedidoResponseDTO estornarPagamento(Long pedidoId, String motivo) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        boolean gerenteOuAdmin = autenticacao != null && autenticacao.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GERENTE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!gerenteOuAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas gerente ou admin pode estornar diretamente.");
        }

        Pedido pedido = buscarPedido(pedidoId);
        validarAcessoAoPedido(pedido);

        if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.ESTORNADO) {
            liberarEstoque(pedido);
            pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
            pedidoRepository.save(pedido);
            return pedidoMapper.toDTO(pedido);
        }

        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.PAGO || pedido.getAbacatePayCheckoutId() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Só é possível estornar um pedido pago com checkout associado.");
        }

        try {
            validarResposta(abacatePayService.estornarCheckout(pedido.getAbacatePayCheckoutId(), motivo));
        } catch (HttpClientErrorException.BadRequest ex) {
            String corpo = ex.getResponseBodyAsString();
            if (corpo != null && corpo.contains("já foi reembolsada")) {
                pedido.setEstadoPagamento(EstadoPagamentoEnum.ESTORNADO);
                liberarEstoque(pedido);
                pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
                pedidoRepository.save(pedido);
                return pedidoMapper.toDTO(pedido);
            }
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    corpo != null && !corpo.isBlank() ? corpo : ex.getMessage()
            );
        }

        pedido.setEstadoPagamento(EstadoPagamentoEnum.ESTORNADO);
        liberarEstoque(pedido);
        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(pedido);
    }

    public JsonNode registrarWebhook(String endpoint) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "ABACATEPAY_WEBHOOK_SECRET não está configurado.");
        }
        String url = endpoint == null || endpoint.isBlank() ? webhookEndpoint : endpoint;
        if (url == null || !(url.startsWith("https://") || url.startsWith("http://localhost"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um endpoint HTTPS público ou localhost para testes.");
        }
        return validarResposta(abacatePayService.registrarWebhook(url, webhookSecret));
    }

    private void liberarEstoque(Pedido pedido) {
        if (!Boolean.TRUE.equals(pedido.getEstoqueBaixado())) {
            return;
        }
        for (ItemPedido item : itemPedidoRepository.findByIdPedido(pedido.getId())) {
            produtoClient.liberarEstoque(item.getIdProduto(), item.getQuantidade());
        }
        pedido.setEstoqueBaixado(false);
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id).orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado com o ID: " + id));
    }

    private JsonNode validarResposta(JsonNode resposta) {
        if (resposta == null || !resposta.path("success").asBoolean(false)) {
            String erro = resposta == null ? "Resposta vazia da AbacatePay" : resposta.path("error").asString("A AbacatePay recusou a operação.");
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, erro);
        }
        return resposta.path("data");
    }

    private void validarAcessoAoPedido(Pedido pedido) {
        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticação necessária."
            );
        }

        boolean gerenteOuAdmin = autenticacao.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_GERENTE")
                        || authority.getAuthority().equals("ROLE_ADMIN"));

        if (gerenteOuAdmin) {
            return;
        }

        Object usuarioId = autenticacao.getDetails();

        if (!(usuarioId instanceof Long idCliente)
                || !idCliente.equals(pedido.getIdCliente())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar este pedido."
            );
        }
    }
}
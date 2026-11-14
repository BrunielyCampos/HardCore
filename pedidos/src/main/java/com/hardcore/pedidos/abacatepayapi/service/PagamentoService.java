package com.hardcore.pedidos.abacatepayapi.service;

import tools.jackson.databind.JsonNode;
import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final AbacatePayService abacatePayService;
    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    @Value("${abacatepay.webhook.secret}")
    private String webhookSecret;

    @Value("${abacatepay.webhook.endpoint:}")
    private String webhookEndpoint;

    @Transactional
    public PedidoResponseDTO criarCheckout(CriarCheckoutDTO dto) {
        Pedido pedido = buscarPedido(dto.pedidoId());

        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Só é possível criar checkout para pagamento pendente.");
        }
        if (pedido.getAbacatePayCheckoutId() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este pedido já possui um checkout.");
        }

        List<Map<String, Object>> itens = dto.itens().stream()
                .map(item -> Map.<String, Object>of(
                        "id", item.id(),
                        "quantity", item.quantity()))
                .toList();

        String externalId = "pedido-" + pedido.getId();
        List<String> methods = pedido.getTipoPagamento() == TipoPagamentoEnum.PIX
                ? List.of("PIX") : List.of("CARD");

        JsonNode resposta = abacatePayService.criarCheckout(itens, externalId, methods);
        JsonNode data = validarResposta(resposta);

        String checkoutId = data.path("id").asString(null);
        String url = data.path("url").asString(null);

        if (checkoutId == null || url == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "A AbacatePay não retornou o ID e a URL do checkout.");
        }

        pedido.setAbacatePayCheckoutId(checkoutId);
        pedido.setUrlPagamento(url);
        pedidoRepository.save(pedido);

        return pedidoMapper.toDTO(pedido);
    }

    public JsonNode consultarCheckoutDoPedido(Long pedidoId) {
        Pedido pedido = buscarPedido(pedidoId);
        if (pedido.getAbacatePayCheckoutId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "O pedido ainda não possui checkout.");
        }
        return abacatePayService.consultarCheckout(pedido.getAbacatePayCheckoutId());
    }

    @Transactional
    public PedidoResponseDTO cancelarPagamento(Long pedidoId) {
        Pedido pedido = buscarPedido(pedidoId);

        if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.ESTORNADO
                || pedido.getEstadoPagamento() == EstadoPagamentoEnum.CANCELADO) {
            return pedidoMapper.toDTO(pedido);
        }
        if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.EM_DISPUTA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Pedido em disputa não pode ser cancelado automaticamente.");
        }

        if (pedido.getAbacatePayCheckoutId() != null) {
            if (pedido.getEstadoPagamento() == EstadoPagamentoEnum.PAGO) {
                validarResposta(abacatePayService.estornarCheckout(
                        pedido.getAbacatePayCheckoutId(), "Cancelamento do pedido " + pedidoId));
                pedido.setEstadoPagamento(EstadoPagamentoEnum.ESTORNADO);
            } else {
                validarResposta(abacatePayService.cancelarCheckout(pedido.getAbacatePayCheckoutId()));
                pedido.setEstadoPagamento(EstadoPagamentoEnum.CANCELADO);
            }
        } else {
            pedido.setEstadoPagamento(EstadoPagamentoEnum.CANCELADO);
        }

        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO estornarPagamento(Long pedidoId, String motivo) {
        Pedido pedido = buscarPedido(pedidoId);
        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.PAGO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Só é possível estornar um pagamento que esteja pago.");
        }
        if (pedido.getAbacatePayCheckoutId() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Pedido não possui checkout associado.");
        }

        validarResposta(abacatePayService.estornarCheckout(
                pedido.getAbacatePayCheckoutId(), motivo));

        pedido.setEstadoPagamento(EstadoPagamentoEnum.ESTORNADO);
        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(pedido);
    }

    public JsonNode registrarWebhook(String endpoint) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "ABACATEPAY_WEBHOOK_SECRET não está configurado.");
        }
        String url = endpoint == null || endpoint.isBlank() ? webhookEndpoint : endpoint;
        if (url == null || !(url.startsWith("https://") || url.startsWith("http://localhost"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe um endpoint HTTPS público ou localhost para testes.");
        }
        return validarResposta(abacatePayService.registrarWebhook(url, webhookSecret));
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException(
                        "Pedido não encontrado com o ID: " + id));
    }

    private JsonNode validarResposta(JsonNode resposta) {
        if (resposta == null || resposta.path("success").asBoolean(false) == false) {
            String erro = resposta == null ? "Resposta vazia da AbacatePay"
                    : resposta.path("error").asString("A AbacatePay recusou a operação.");
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, erro);
        }
        return resposta.path("data");
    }
}

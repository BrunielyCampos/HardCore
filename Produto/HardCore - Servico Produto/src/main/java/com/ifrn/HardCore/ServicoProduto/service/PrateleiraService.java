package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueResponseDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.EstoqueNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.PrateleiraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrateleiraService {
    private PrateleiraRepository repository;
    private EstoqueRepository estoqueRepository;

    public PrateleiraService(PrateleiraRepository repository) {
        this.repository = repository;
    }

    public PrateleiraResponseDTO criarPrateleira(PrateleiraRequestDTO dto){
        Prateleira salva = repository.save(ToEntity(dto));

        return ToResponseDTo(salva);
    }

    public List<PrateleiraResponseDTO> listarPrateleira(){
        List<Prateleira> prateleiras = repository.findAll();

        return prateleiras.stream().map(this::ToResponseDTo).toList();
    }

    //To do: Listar prateleiraById

    @Transactional
    public PrateleiraResponseDTO transferirParaPrateleira(Long produtoId, int quantidade) {

        Estoque estoque =
                estoqueRepository.findByProdutoId(produtoId).orElseThrow(() -> new EstoqueNaoEncontradoException(produtoId));

        Optional<Prateleira> prateleira = repository.findByProdutosId(produtoId);


        // 2. Verificar se existe estoque suficiente

        Prateleira pratAux = null;

        if (prateleira.isPresent()){
            estoque.setQuantidadeProduto(estoque.getQuantidadeProduto() - quantidade);

            pratAux = prateleira.get();

            pratAux.setQuantidade_produto(pratAux.getQuantidade_produto() + quantidade);
        }
        else {
            
        }


        // 5. Se não estiver, associar o produto à prateleira

        // 6. Atualizar a quantidade disponível na prateleira

        // 7. Descontar a quantidade do estoque
    }


    public Prateleira ToEntity(PrateleiraRequestDTO dto){
        return new Prateleira(null,dto.getQuantidade_produto());
    }

    public PrateleiraResponseDTO ToResponseDTo(Prateleira prat){
        PrateleiraResponseDTO dto = new PrateleiraResponseDTO();

        dto.setId(prat.getId());
        dto.setQuantidade_produto(prat.getQuantidade_produto());

        if (prat.getProdutos() != null) {
            List<Long> ids = prat.getProdutos().stream()
                    .map(Produto::getId)
                    .collect(Collectors.toList());
            dto.setProdutoIds(ids);
        }

        return dto;
    }
}

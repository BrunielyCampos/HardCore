package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.EstoqueNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.PrateleiraRepository;
import org.springframework.stereotype.Service;
import java.util.List;
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

    /*
        public PrateleiraResponseDTO TransferirParaPrateleira(Long idProduto, Long idPrateleira,int qtdTransferencia){
            //To do: Antes preciso arrumar o relacionamento com produto.
        }
    */

    public Long BuscarIdProdutoEstoque(Long id){
       Estoque estoqueid =
               estoqueRepository.findByProdutoId(id).orElseThrow(() -> new EstoqueNaoEncontradoException(id));

       return estoqueid.getId();
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

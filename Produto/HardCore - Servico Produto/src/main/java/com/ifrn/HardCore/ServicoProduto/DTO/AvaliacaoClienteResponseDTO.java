package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteResponseDTO {

    private Long id;

    private boolean avaliacao;

    private String campoComentario;

    private Long produto_id;

    public AvaliacaoClienteResponseDTO(Long id, boolean avaliacao, String campoComentario, Long produto_id) {
        this.id = id;
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
        this.produto_id = produto_id;
    }
}

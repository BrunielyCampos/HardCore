package com.ifrn.hardcore.produto.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteResponseDTO {

    private Long id;
    private Boolean avaliacao;
    private String campoComentario;
    private Long produto_id;
    private Long autorId;
    private String autorTipo;

    public AvaliacaoClienteResponseDTO(
            Long id,
            Boolean avaliacao,
            String campoComentario,
            Long produto_id,
            Long autorId,
            String autorTipo) {
        this.id = id;
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
        this.produto_id = produto_id;
        this.autorId = autorId;
        this.autorTipo = autorTipo;
    }
}
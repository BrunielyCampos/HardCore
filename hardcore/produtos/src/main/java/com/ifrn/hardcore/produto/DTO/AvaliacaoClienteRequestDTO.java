package com.ifrn.hardcore.produto.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteRequestDTO {

    private boolean avaliacao;

    private String campoComentario;
    @NotNull
    private Long produto_id;

    public AvaliacaoClienteRequestDTO(boolean avaliacao, String campoComentario, @NotNull Long produto_id) {
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
        this.produto_id = produto_id;
    }
}

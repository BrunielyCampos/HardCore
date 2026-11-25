package com.ifrn.hardcore.produto.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteRequestDTO {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer avaliacao;

    private String campoComentario;

    @NotNull
    private Long produto_id;

    public AvaliacaoClienteRequestDTO(Integer avaliacao, String campoComentario, @NotNull Long produto_id) {
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
        this.produto_id = produto_id;
    }
}
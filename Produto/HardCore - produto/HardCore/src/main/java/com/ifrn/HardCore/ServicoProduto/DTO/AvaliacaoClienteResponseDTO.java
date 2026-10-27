package com.ifrn.HardCore.ServicoProduto.DTO;

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

    public AvaliacaoClienteResponseDTO(Long id, boolean avaliacao, String campoComentario) {
        this.id = id;
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
    }
}

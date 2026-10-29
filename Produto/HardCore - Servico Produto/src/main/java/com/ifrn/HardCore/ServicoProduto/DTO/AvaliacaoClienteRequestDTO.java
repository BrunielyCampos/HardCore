package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteRequestDTO {

    @NotNull
    private boolean avaliacao;

    private String campoComentario;

    private Long produto_id;

    public AvaliacaoClienteRequestDTO(@NotNull boolean avaliacao, String campoComentario, Long produto_id) {
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
        this.produto_id = produto_id;
    }
}

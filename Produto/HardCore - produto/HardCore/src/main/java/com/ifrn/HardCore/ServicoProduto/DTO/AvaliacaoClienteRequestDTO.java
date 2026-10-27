package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class AvaliacaoClienteRequestDTO {

    @NonNull
    private boolean avaliacao;

    private String campoComentario;

    public AvaliacaoClienteRequestDTO(@NonNull boolean avaliacao, String campoComentario) {
        this.avaliacao = avaliacao;
        this.campoComentario = campoComentario;
    }
}

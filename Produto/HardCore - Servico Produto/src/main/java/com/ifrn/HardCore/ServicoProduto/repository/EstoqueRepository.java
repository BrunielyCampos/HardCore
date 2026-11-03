package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    Optional<Estoque> findByProdutoId(Long produtoId);

}

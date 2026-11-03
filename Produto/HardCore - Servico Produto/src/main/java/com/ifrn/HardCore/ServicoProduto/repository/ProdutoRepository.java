package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByCategoriaAllIgnoreCase(String categoria);

    List<Produto> findByMarcaAllIgnoreCase(String marca);

    Optional <Produto> findById(Long produtoId);
}

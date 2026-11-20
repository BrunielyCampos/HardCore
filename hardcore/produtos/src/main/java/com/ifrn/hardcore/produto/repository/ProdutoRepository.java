package com.ifrn.hardcore.produto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifrn.hardcore.produto.Entity.Produto;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByCategoriaAllIgnoreCase(String categoria);

    List<Produto> findByMarcaAllIgnoreCase(String marca);

    Optional <Produto> findById(Long produtoId);
}

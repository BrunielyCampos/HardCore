package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Long, Produto> {

    public Optional<Produto> findByCategoriaAllIgnoreCase(String categoria);

    public Optional<Produto> findByMarcaAllIgnoreCase(String marca);
}

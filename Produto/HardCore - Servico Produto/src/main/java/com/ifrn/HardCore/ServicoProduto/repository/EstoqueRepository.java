package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    Optional<Estoque> findByProdutoId(Long produtoId);

    List<Estoque> findByQuantidadeProdutoLessThanEqual(int qtdProduto);
    List<Estoque> findByQuantidadeProdutoGreaterThanEqual(int qtdProduto);



}

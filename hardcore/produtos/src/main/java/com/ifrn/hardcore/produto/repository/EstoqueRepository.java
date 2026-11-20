package com.ifrn.hardcore.produto.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ifrn.hardcore.produto.Entity.Estoque;
import java.util.List;
import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    Optional<Estoque> findByProdutoId(Long produtoId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Estoque e SET e.quantidadeProduto = e.quantidadeProduto - :quantidade WHERE e.produto.id = :produtoId AND e.quantidadeProduto >= :quantidade")
    int reservarQuantidade(@Param("produtoId") Long produtoId, @Param("quantidade") int quantidade);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Estoque e SET e.quantidadeProduto = e.quantidadeProduto + :quantidade WHERE e.produto.id = :produtoId")
    int liberarQuantidade(@Param("produtoId") Long produtoId, @Param("quantidade") int quantidade);

    List<Estoque> findAllByOrderByQuantidadeProdutoAsc(Pageable pageable);
    List<Estoque> findAllByOrderByQuantidadeProdutoDesc(Pageable pageable);
}
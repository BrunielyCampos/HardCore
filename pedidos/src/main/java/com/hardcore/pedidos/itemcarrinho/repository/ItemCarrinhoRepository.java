package com.hardcore.pedidos.itemcarrinho.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hardcore.pedidos.itemcarrinho.model.ItemCarrinho;
import java.util.List;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
    List<ItemCarrinho> findByIdCarrinho(Long idCarrinho);
}
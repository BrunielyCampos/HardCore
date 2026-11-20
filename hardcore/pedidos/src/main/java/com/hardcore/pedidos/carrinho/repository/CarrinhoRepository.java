package com.hardcore.pedidos.carrinho.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hardcore.pedidos.carrinho.model.Carrinho;
import java.util.Optional;

public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {
    Optional<Carrinho> findByIdCliente(Long idCliente);
}
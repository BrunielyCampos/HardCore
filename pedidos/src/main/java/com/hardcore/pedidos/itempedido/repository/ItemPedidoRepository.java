package com.hardcore.pedidos.itempedido.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import java.util.List;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    List<ItemPedido> findByIdPedido(Long idPedido);
}
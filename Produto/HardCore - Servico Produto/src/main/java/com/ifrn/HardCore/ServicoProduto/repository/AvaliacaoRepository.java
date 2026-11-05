package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.AvaliacaoCliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<AvaliacaoCliente, Long> {

    List<AvaliacaoCliente> findAllByProdutoId(Long id);

}


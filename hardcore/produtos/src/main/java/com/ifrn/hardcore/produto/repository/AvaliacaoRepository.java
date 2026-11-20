package com.ifrn.hardcore.produto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ifrn.hardcore.produto.Entity.AvaliacaoCliente;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<AvaliacaoCliente, Long> {

    List<AvaliacaoCliente> findAllByProdutoId(Long id);

}


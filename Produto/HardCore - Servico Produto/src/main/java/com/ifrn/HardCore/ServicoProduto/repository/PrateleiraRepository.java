package com.ifrn.HardCore.ServicoProduto.repository;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrateleiraRepository extends JpaRepository<Prateleira, Long> {

    Optional<Prateleira> findByProdutoId(Long id);
    Optional<Prateleira> findFirstByOrderByIdAsc();

}

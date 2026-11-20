package com.ifrn.hardcore.produto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ifrn.hardcore.produto.Entity.Prateleira;
import java.util.Optional;

public interface PrateleiraRepository extends JpaRepository<Prateleira, Long> {

    Optional<Prateleira> findByProdutoId(Long id);
    Optional<Prateleira> findFirstByOrderByIdAsc();

}

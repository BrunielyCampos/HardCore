package com.hardcore.pedidos.webhook.repository;

import com.hardcore.pedidos.webhook.model.WebhookRecebido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebhookRecebidoRepository extends JpaRepository<WebhookRecebido, String> {
}

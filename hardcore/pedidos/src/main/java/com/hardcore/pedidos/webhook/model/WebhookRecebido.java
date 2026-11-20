package com.hardcore.pedidos.webhook.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_webhook_abacatepay")
@Data
@RequiredArgsConstructor
public class WebhookRecebido {

    @Id
    @Column(name = "id_evento", length = 100)
    private String id;

    @Column(name = "tipo_evento", nullable = false, length = 80)
    private String tipoEvento;

    @Column(name = "data_recebimento", nullable = false)
    private LocalDateTime dataRecebimento;

    public WebhookRecebido(String id, String tipoEvento) {
        this.id = id;
        this.tipoEvento = tipoEvento;
        this.dataRecebimento = LocalDateTime.now();
    }
}

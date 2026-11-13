ALTER TABLE tb_pedido
ADD COLUMN status_pagamento VARCHAR(30) NOT NULL DEFAULT 'PENDENTE';

ALTER TABLE tb_pedido
ADD COLUMN abacatepay_checkout_id VARCHAR(100);

ALTER TABLE tb_pedido
ADD COLUMN url_pagamento TEXT;

CREATE TABLE tb_webhook_abacatepay (
    id_evento VARCHAR(100) PRIMARY KEY,
    tipo_evento VARCHAR(80) NOT NULL,
    data_recebimento TIMESTAMP NOT NULL
);
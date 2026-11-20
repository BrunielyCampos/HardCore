CREATE TYPE estado_entrega_enum AS ENUM ('PENDENTE', 'EM_ENTREGA', 'ENTREGA_FEITA', 'CANCELADA');

CREATE TABLE entrega (
    id BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_entregador BIGINT NOT NULL,
    endereco_destino VARCHAR(255) NOT NULL,
    estado_entrega estado_entrega_enum NOT NULL,
    confirmacao_cliente BOOLEAN
);
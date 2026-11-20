CREATE TABLE tb_carrinho (
    id BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL UNIQUE
);

CREATE TABLE tb_item_carrinho (
    id BIGSERIAL PRIMARY KEY,
    id_carrinho BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_item_carrinho FOREIGN KEY (id_carrinho) REFERENCES tb_carrinho(id) ON DELETE CASCADE
);

CREATE TABLE tb_pedido (
    id BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    valor_compra DOUBLE PRECISION NOT NULL,
    data_compra TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL,
    tipo_pagamento VARCHAR(50) NOT NULL
);

CREATE TABLE tb_item_pedido (
    id BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES tb_pedido(id) ON DELETE CASCADE
);
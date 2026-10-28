CREATE TABLE IF NOT EXISTS tb_admin (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

INSERT INTO tb_admin (email, senha)
VALUES ('admin@hardware.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
ALTER TABLE tb_avaliacao_cliente
    ALTER COLUMN avaliacao TYPE BOOLEAN
    USING (
        CASE
            WHEN avaliacao IS NULL THEN NULL
            WHEN avaliacao >= 3 THEN TRUE
            ELSE FALSE
        END
    );
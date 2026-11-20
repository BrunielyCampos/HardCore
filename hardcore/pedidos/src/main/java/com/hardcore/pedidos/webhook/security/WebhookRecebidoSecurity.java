package com.hardcore.pedidos.webhook.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class WebhookRecebidoSecurity {

    @Value("${abacatepay.webhook.secret}")
    private String webhookSecret;

    private static final String CHAVE_PUBLICA_ABACATEPAY =
            "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

    public boolean validarSecret(String recebido) {

        if (recebido == null || webhookSecret == null) {
            return false;
        }
        return MessageDigest.isEqual(recebido.getBytes(StandardCharsets.UTF_8), webhookSecret.getBytes(StandardCharsets.UTF_8));
    }

    public boolean validarAssinatura(byte[] corpo, String assinaturaRecebida) {

        if (corpo == null || assinaturaRecebida == null) {
            return false;
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec chave = new SecretKeySpec(
                    CHAVE_PUBLICA_ABACATEPAY.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );

            mac.init(chave);
            byte[] resultado = mac.doFinal(corpo);

            String assinaturaEsperada =
                    Base64.getEncoder().encodeToString(resultado);

            return MessageDigest.isEqual(
                    assinaturaEsperada.getBytes(StandardCharsets.US_ASCII),
                    assinaturaRecebida.getBytes(StandardCharsets.US_ASCII)
            );

        } catch (Exception e) {
            return false;
        }
    }
}
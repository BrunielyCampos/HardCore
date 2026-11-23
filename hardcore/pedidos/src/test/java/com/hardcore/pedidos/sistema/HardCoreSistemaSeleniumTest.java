
package com.hardcore.pedidos.sistema;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class HardCoreSistemaSeleniumTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String FRONT_URL = "http://localhost:5173";

    @BeforeEach
    void iniciarNavegador() {

        ChromeOptions options = new ChromeOptions();

        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        prefs.put("profile.password_manager_leak_detection", false);

        options.setExperimentalOption("prefs", prefs);
        options.addArguments("--incognito");

        driver = new ChromeDriver(options);

        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterEach
    void fecharNavegador() {

        if (driver != null) {
            driver.quit();
        }
    }

    // =====================================================
    // MÉTODO AUXILIAR: LOCALIZAR E CLICAR EM BOTÕES
    // =====================================================

    private void clicarBotao(By localizador) {

        WebElement botao = wait.until(
                ExpectedConditions.presenceOfElementLocated(localizador)
        );

        // Centraliza o botão na área visível da tela
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
                botao
        );

        // Aguarda o botão ficar disponível para clique
        wait.until(ExpectedConditions.elementToBeClickable(botao));

        // Realiza o clique normal do Selenium
        botao.click();
    }

    // =====================================================
    // MÉTODO AUXILIAR: CAPTURAR PRINT EM CASO DE FALHA
    // =====================================================

    private void capturarScreenshot(String nomeArquivo) {

        if (driver instanceof TakesScreenshot) {

            try {
                File origem = ((TakesScreenshot) driver)
                        .getScreenshotAs(OutputType.FILE);

                File destino = new File(nomeArquivo + ".png");

                Files.copy(
                        origem.toPath(),
                        destino.toPath(),
                        StandardCopyOption.REPLACE_EXISTING
                );

                System.out.println(
                        "Screenshot salvo em: " + destino.getAbsolutePath()
                );

            } catch (IOException e) {
                System.out.println(
                        "Não foi possível salvar o screenshot: " + e.getMessage()
                );
            }
        }
    }

    // =====================================================
    // TESTE 1: GERENTE CADASTRA E PUBLICA PRODUTO
    // =====================================================

    @Test
    @Order(1)
    @DisplayName("TS1 (F3 - CT-EST-01 / CT-EST-03): Gerente autentica, cadastra produto e publica na vitrine")
    void deveAutenticarGerenteECadastrarProdutoNaLoja() {

        try {

            driver.get(FRONT_URL + "/login");

            // 1. Login como Gerente
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.id("email")
            )).sendKeys("gerente@hardcore.com");

            driver.findElement(By.id("senha"))
                    .sendKeys("123456");

            clicarBotao(By.cssSelector("button[type='submit']"));

            // 2. Aguarda redirecionamento
            wait.until(ExpectedConditions.urlToBe(FRONT_URL + "/"));

            driver.get(FRONT_URL + "/cadastrar-produto");

            // 3. Preenchimento do cadastro
            String nomeProduto = "SSD NVMe HardCore 1TB Selenium";

            String skuUnico = "HC-SEL-" +
                    (System.currentTimeMillis() % 100000);

            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[contains(@placeholder,'RTX 4060')]")
            )).sendKeys(nomeProduto);

            driver.findElement(
                    By.xpath("//input[contains(@placeholder,'HC-GPU-001')]")
            ).sendKeys(skuUnico);

            // 4. Seleciona Em Oferta
            Select selectVitrine = new Select(
                    driver.findElement(
                            By.xpath("//label[contains(text(),'Exibir na Vitrine')]/following-sibling::div//select")
                    )
            );

            selectVitrine.selectByValue("Oferta");

            // 5. Descrição
            driver.findElement(By.tagName("textarea"))
                    .sendKeys("SSD M.2 PCIe Gen4 1TB testado via Selenium.");

            // 6. Preço
            driver.findElement(
                    By.xpath("//input[contains(@placeholder,'1199.99')]")
            ).sendKeys("499.90");

            // 7. Estoque
            WebElement campoEstoque = driver.findElement(
                    By.xpath("//label[contains(text(),'Quantidade em estoque')]/following-sibling::input")
            );

            campoEstoque.clear();
            campoEstoque.sendKeys("15");

            // 8. Salvar e publicar
            clicarBotao(
                    By.xpath("//button[contains(text(),'SALVAR E PUBLICAR')]")
            );

            // 9. Aguarda listagem
            wait.until(ExpectedConditions.urlContains("/gerenciar-produtos"));

            assertTrue(
                    driver.getPageSource().contains(nomeProduto),
                    "O produto recém-publicado deve aparecer na listagem de gerenciamento."
            );

        } catch (Exception e) {

            capturarScreenshot("erro_teste_cadastro_produto");

            throw e;
        }
    }

    // =====================================================
    // TESTE 2: CLIENTE REALIZA COMPRA ATÉ CHECKOUT PIX
    // =====================================================

    @Test
    @Order(2)
    @DisplayName("TS2 (F1 - CT-CEN-01): Cliente faz login, seleciona produto, informa endereço e gera checkout PIX")
    void deveExecutarFluxoCompletoDeCompraAteCheckoutPix() {

        try {

            driver.get(FRONT_URL + "/login");

            // 1. Login como Cliente
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.id("email")
            )).sendKeys("cliente@hardcore.com");

            driver.findElement(By.id("senha"))
                    .sendKeys("123456");

            clicarBotao(By.cssSelector("button[type='submit']"));

            // 2. Aguarda a Home
            wait.until(ExpectedConditions.urlToBe(FRONT_URL + "/"));

            // 3. Localiza os produtos disponíveis
            List<WebElement> cardsProdutos = wait.until(
                    ExpectedConditions.presenceOfAllElementsLocatedBy(
                            By.cssSelector("a[href^='/produto/']")
                    )
            );

            assertFalse(
                    cardsProdutos.isEmpty(),
                    "Não existem produtos disponíveis na vitrine."
            );

            // Seleciona o último produto
            WebElement ultimoProduto =
                    cardsProdutos.get(cardsProdutos.size() - 1);

            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].scrollIntoView({block: 'center'});",
                    ultimoProduto
            );

            wait.until(ExpectedConditions.elementToBeClickable(
                    ultimoProduto
            )).click();

            // 4. Aguarda a página de detalhes
            wait.until(ExpectedConditions.urlContains("/produto/"));

            // 5. Localiza o botão Comprar
            By localizarComprar = By.xpath(
                    "//button[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'COMPRAR')]"
            );

            WebElement btnComprar = wait.until(
                    ExpectedConditions.presenceOfElementLocated(localizarComprar)
            );

            // Centraliza o botão na tela
            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
                    btnComprar
            );

            // Aguarda o botão ficar clicável
            wait.until(
                    ExpectedConditions.elementToBeClickable(btnComprar)
            );

            // Clique normal
            btnComprar.click();

            // 6. Aguarda o carrinho
            wait.until(ExpectedConditions.urlContains("/carrinho"));

            clicarBotao(
                    By.xpath("//button[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'CONTINUAR')]")
            );

            // 7. Aguarda identificação
            wait.until(ExpectedConditions.urlContains("/identificacao"));

            // Preenche endereço
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.name("rua")
            )).sendKeys("Rua Getúlio Vargas");

            driver.findElement(By.name("bairro"))
                    .sendKeys("Centro");

            driver.findElement(By.name("numero"))
                    .sendKeys("150");

            driver.findElement(By.name("complemento"))
                    .sendKeys("Sala 02");

            // Continua para pagamento
            clicarBotao(
                    By.xpath("//button[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'CONTINUAR')]")
            );

            // 8. Aguarda pagamento
            wait.until(ExpectedConditions.urlContains("/pagamento"));

            // Verifica erro 500
            assertFalse(
                    driver.getPageSource().contains("Internal Server Error"),
                    "Falha no backend (HTTP 500) ao tentar gerar o QR Code PIX."
            );

            // 9. Verifica título PIX
            WebElement tituloPix = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.xpath("//h2[contains(text(),'Pagamento via PIX')]")
                    )
            );

            assertTrue(
                    tituloPix.isDisplayed(),
                    "A tela de pagamento PIX deve ser exibida ao final do checkout."
            );

        } catch (Exception e) {

            capturarScreenshot("erro_teste_checkout_pix");

            throw e;
        }
    }
}

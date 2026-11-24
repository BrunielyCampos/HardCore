# HardCore

- **O que é o projeto?**
   - A HardCore é uma loja de e-comerce voltada para o comercio de hardware, como placas de video, teclado, mouse, entre outros, foi criada com o objeto de criar um projeto para as matérias de desenvolvimento de sistemas corporativos, gerencia de projeto e teste de software do curso de análise e desenvolvimento de sistemas. 

### 1. Organização das branches

- **`main`:** armazenará a versão principal e estável do projeto.
- **`develop-nomeMicroservico`:** cada microserviço terá sua própria branch de desenvolvimento.
- **`feature/novaFuncionalidade`:** branches criadas a partir da `develop` correspondente para implementar novas funcionalidades.

### 2. Fluxo de desenvolvimento

1. Criar uma branch `feature` a partir da `develop` do microserviço correspondente.
2. Desenvolver e testar a funcionalidade na pasta do respectivo microserviço.
3. Integrar a `feature` à sua `develop` por meio de um Pull Request.
4. Quando o microserviço estiver pronto para integrar a versão principal, abrir um Pull Request da sua `develop` para a `main`.


### 3. Execução dos testes

Os testes do HardCore foram desenvolvidos utilizando JUnit 5, Mockito, Selenium WebDriver e JaCoCo. Foram realizados testes unitários, de integração e de interface.

#### 3.1. Pré-requisitos

- Java JDK 25.
- Maven 3.9.16.
- Node.js e npm.
- Docker.
- PostgreSQL.
- RabbitMQ.
- Google Chrome.

#### 3.2. Testes unitários

Os testes unitários estão distribuídos entre os microserviços de pedidos, entrega e produtos.

Para executar os testes unitários, acesse a pasta do microserviço correspondente e utilize o comando:

**Pedidos:**

    mvn test "-Dtest=*UnitTest"

**Entrega:**

    mvn test "-Dtest=*UnitTest"

**Produtos:**

    mvn test "-Dtest=*UnitTest"

Os resultados podem ser consultados na pasta `target/surefire-reports` de cada microserviço.

#### 3.3. Testes de integração

Foram realizadas duas integrações:

- Integração entre pagamento e estoque.
- Integração entre pedidos e mensageria RabbitMQ.

Para executar os testes, inicialize os contêineres do PostgreSQL e RabbitMQ pelo Docker.

**Integração entre pagamento e estoque:**

Inicialize o microserviço de produtos na porta 8082. Em seguida, acesse a pasta do microserviço de pedidos e execute:

    mvn clean test "-Dtest=PagamentoEstoqueTest" jacoco:report

**Integração entre pedidos e RabbitMQ:**

Mantenha o RabbitMQ em execução e encerre a instância externa do microserviço de pedidos, evitando que outro consumidor receba as mensagens destinadas ao teste.

Na pasta do microserviço de pedidos, execute:

    mvn clean test "-Dtest=EntregaPedidoRabbitMQIntegrationTest" jacoco:report

Os relatórios de execução e cobertura podem ser encontrados nos seguintes caminhos:

- Surefire: `target/surefire-reports/`
- JaCoCo: `target/site/jacoco/index.html`

O comando `clean` remove os relatórios anteriores. Por isso, salve o relatório de cada integração antes de executar a próxima.

#### 3.4. Testes de interface com Selenium

Os testes de interface foram desenvolvidos utilizando Selenium WebDriver e JUnit 5.

Foram automatizados dois fluxos:

- Cadastro e publicação de produto pelo gerente.
- Fluxo de compra até a tela de pagamento PIX.

Para executar os testes:

1. Inicialize os contêineres do PostgreSQL e RabbitMQ.
2. Inicialize os microserviços de usuários, produtos, pedidos e entrega.
3. Prepare as contas fictícias utilizadas nos testes:

| Usuário | E-mail | Senha de teste |
|---|---|---|
| Gerente | gerente@hardcore.com | 123456 |
| Cliente | cliente@hardcore.com | 123456 |

4. Garanta que exista pelo menos um produto disponível para compra na vitrine.
5. Prepare o banco de dados de teste, removendo os registros de execuções anteriores que possam interferir no resultado e garantindo que o carrinho do cliente esteja vazio.
6. Acesse a pasta `HardCore-Front` e execute:

       npm install
       npm run dev

7. Verifique se o frontend está disponível em http://localhost:5173.
8. Abra outro terminal na pasta do microserviço de pedidos e execute:

       mvn test "-Dtest=HardCoreSistemaSeleniumTest"

9. Aguarde a execução dos testes sem interferir no navegador.

A classe de teste está localizada em:

`pedidos/src/test/java/com/hardcore/pedidos/sistema/HardCoreSistemaSeleniumTest.java`

O resultado da execução pode ser consultado no arquivo:

`pedidos/target/surefire-reports/com.hardcore.pedidos.sistema.HardCoreSistemaSeleniumTest.txt`

Caso ocorra alguma exceção interceptada durante os testes, o Selenium poderá gerar capturas de tela para auxiliar na identificação do problema.

Os testes devem ser realizados apenas em ambiente local ou de teste, utilizando dados fictícios.

#### 3.5. Documentação e acompanhamento dos testes

Os testes e as melhorias identificadas durante sua execução estão registrados no Jira.

- [HRC-151 – Relatório de testes unitários](https://kalineollyver123.atlassian.net/browse/HRC-151)
- [HRC-73 – Relatório de testes de integração](https://kalineollyver123.atlassian.net/browse/HRC-73)
- [HRC-152 – Relatório de testes de interface com Selenium](https://kalineollyver123.atlassian.net/browse/HRC-152)
- [HRC-153 – Melhoria de testabilidade do cadastro de produtos](https://kalineollyver123.atlassian.net/browse/HRC-153)
- [HRC-154 – Melhoria de testabilidade do fluxo de compra e pagamento PIX](https://kalineollyver123.atlassian.net/browse/HRC-154)
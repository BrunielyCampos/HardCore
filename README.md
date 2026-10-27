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

### ☕ CafeFlow - Sistema Comercial de Reserva de Mesas

> Link da Aplicação: [cafeflow-front.vercel.app](https://cafeflow-front.vercel.app/))
> Link da API (Swagger): [://onrender.com](https://cafeflow-api-2lob.onrender.com/swagger-ui/index.html)

O **CafeFlow** é uma solução comercial *Full-Stack* completa de gerenciamento e reserva de mesas em tempo real, projetada especialmente para cafeterias que atendem nômades digitais. A aplicação foi construída em uma arquitetura desacoplada, integrando uma API robusta em Java a uma interface reativa em React, ambas hospedadas 100% na nuvem.

* * *

### 🛠️ Tecnologias Utilizadas

### **Front-end**

*   **React (Vite)** + JavaScript Moderno (ES6+)
*   **CSS3 Estruturado** + Flexbox Responsivo
*   **Gerenciamento de Estado Reativo** (`useState`, `useEffect`)
*   **Comunicação Assíncrona** (`Fetch API`) com consumo de Tokens JWT

### **Back-end**

*   **Java 21** + **Spring Boot**
*   **Spring Data JPA** + **SQLite** (Banco de dados embarcado)
*   **Spring Security** + Criptografia de senhas com `BCryptPasswordEncoder`
*   **Autenticação Baseada em Tokens JWT** (Filtro customizado `JwtAuthenticationFilter`)
*   **Documentação da API:** OpenAPI 3 / Swagger

### **DevOps & Infraestrutura**

*   **Docker** (Containerização completa da API Back-end)
*   **Render** (Hospedagem da API Dockerizada)
*   **Vercel** (Hospedagem estática e automatizada do Front-end)

* * *

### 🚀 Diferenciais Técnicos e Regras de Negócio

O sistema simula um ambiente de negócios real, aplicando regras estritas validadas no servidor:

*   **Segurança por Perfis:** Controle de acesso baseado em Roles (`ADMIN` vs `USER`), protegendo endpoints de gerenciamento.
*   **Validação de Fluxo Financeiro:** Regra de negócio integrada que exige um valor mínimo de recarga/reserva de R$ 10,00 por operação.
*   **Sincronização Reativa:** O Dashboard do cliente atualiza o estado dos cartões de mesa instantaneamente de `🟢 Livre` para `🔴 Ocupada` no momento do clique, omitindo o botão de reserva e mitigando a necessidade de recarregamento manual (F5) da página.
*   **Suporte Total a CORS:** API configurada especificamente para aceitar e validar requisições seguras vindas do domínio da Vercel.

* * *

### 💻 Como Rodar o Projeto Localmente

Como a aplicação é dividida em ecossistemas independentes, você precisará clonar e rodar ambos os repositórios:

### 📡 1. Configurando o Back-end (Java)

bash

    # Clone o repositório da API
    git clone https://github.com/felipecavcastro/cafeflow-api
    
    # Acesse a pasta do projeto
    cd cafeflow
    
    # Execute a aplicação Spring Boot
    ./mvnw spring-boot:run
    

Use o código com cuidado.

*A API local iniciará por padrão em `http://localhost:8080`.*

### 💻 2. Configurando o Front-end (React)

bash

    # Clone o repositório da Interface
    git clone https://github.com/felipecavcastro/cafeflow-front
    
    # Acesse a pasta do projeto
    cd cafeflow-front
    
    # Instale as dependências do Node
    npm install
    
    # Crie um arquivo .env na raiz do projeto contendo a URL local:
    # VITE_API_URL=http://localhost:8080
    
    # Inicie o servidor de desenvolvimento
    npm run dev
    

Use o código com cuidado.

*A interface local abrirá em `http://localhost:5173`.*

* * *

### 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, estudar e evoluir o código!

* * *

Developed by Felipe Castro ☕

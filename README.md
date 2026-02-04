# Pet Manager - Projeto de Gerenciamento de Pets e Tutores 

## Dados da inscrição **Processo Seletivo Seplag 2026**:
- Nome: Gabriel Borba Beraldi
- Pefil: Engenheiro da Computação - Sênior 
- Projeto: Frontend

## Como executar o projeto:
- Requisitos: **Docker e Docker Compose**
- Na raiz do projeto, executar `docker compose up --build`
- Abrir no navegador a url: **[http://localhost:8080](http://localhost:8080)**
- Utilizar login e senha: **admin admin**

## Dependencias:
- Angular 18.2.0
- Lucide-angular 0.563.0
- DaisyUi 5.5.14
- Tailwindcss 4.0.0

## Arquitetura:

### Estrutura de pastas:

```text
src/app/
├── core/
│   ├── auth/
│   │   ├── facades/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── configs/
│   ├── facades/
│   ├── models/
│   └── shell/
│       ├── components/ 
│       └── shell.routes.ts
├── features/
│   ├── login/
│   ├── pets/
│   │   ├── components/
│   │   ├── facades/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   └── pets.routes.ts
│   └── tutors/
│       ├── components/
│       ├── facades/
│       ├── models/
│       ├── pages/
│       ├── services/
│       └── tutors.routes.ts
└── shared/
    ├── components/
    ├── directives/
    └── models/
```

A estrutura seguida foi o padrão `core-shared-feature`:

-  **Core**:
 Concentra toda a estrutura global que compõe o sistema.

-  **Features**:
  Contém os módulos de domínio encapsulados.
  Com exceção do Login, cada módulo possui: `services`, `facades`, `pages`, `models` e `services`.
  As páginas são resultado da composição de componentes globais e locais.
  
-  **Shared**:
  Contém todos os recursos reutilizaveis, como: componentes stateless, diretivas e modelos comuns.

## Gerenciamento de estados:

O gerenciamento de estado é feito por meio do `Padrão Facade` com a biblioteca `RxJS`


O projeto utiliza o Facade Pattern com a biblioteca RxJS. Os componentes não acessam o `HttpClient` ou serviços de infraestrutura de forma direta. A sincronização de dados entre múltiplos componentes ocorre por meio de BehaviorSubject dentro das Facades. A UI consome dados via Observables e as alterações de estado ocorrem apenas através de métodos específicos da Facade. Esse modelo centraliza a lógica de negócio e assegura um fluxo de dados unidirecional para facilitar a depuração.

## Justificativa Técnica:

A escolha da arquitetura e dos padrões de projeto visa solucionar problemas comuns em aplicações de grande porte:

- **Desacoplamento**: O uso de Facades impede que mudanças em contratos de APIs ou bibliotecas de terceiros impactem os componentes. Os componentes tornam-se agnósticos à origem dos dados.

- **Desacoplamento**: A divisão por Features com Lazy Loading reduz o tempo de carregamento inicial, baixando apenas o código necessário para a rota acessada.

- **Consistência de Dados**: O estado centralizado via BehaviorSubject garante que, se um Pet for editado em um modal, a listagem em segundo plano seja atualizada automaticamente sem a necessidade de novos requests ou recarregamento de página.

- **Padronização**: O isolamento da lógica de autenticação e interceptação no Core garante que as regras de segurança sejam aplicadas de forma uniforme, eliminando a repetição de lógica nos módulos de negócio.



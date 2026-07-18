<h1 align="center">Aurea</h1>

<p align="center">
  <strong>Plataforma comercial empresarial para precificar projetos, gerar propostas e operar o pipeline de freelancers e consultores.</strong>
</p>

<p align="center">
  <a href="#visão-do-produto">Visão</a> ·
  <a href="#arquitetura">Arquitetura</a> ·
  <a href="#design-system">Design System</a> ·
  <a href="#módulos">Módulos</a> ·
  <a href="#autenticação--dados">Auth & Dados</a> ·
  <a href="#integrações">Integrações</a> ·
  <a href="#tecnologias">Tecnologias</a> ·
  <a href="#instalação">Instalação</a> ·
  <a href="#docker">Docker</a> ·
  <a href="#deploy--cicd">Deploy</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Versão-4.1-success" alt="Versão"/>
</p>

---

## Visão do produto

A **Aurea** é o software B2B para a operação comercial de profissionais independentes:

| Módulo | Capacidade |
|--------|------------|
| **Dashboard** | Receita, clientes, projetos, horas, lucro, gráficos, atividades |
| **Clientes** | CRUD, busca, filtros, ordenação, paginação |
| **Calculadora** | Wizard multi-etapas com validação Zod |
| **Propostas** | Persistência, status, PDF/export, duplicar, editar, excluir |
| **Contratos** | Pipeline de status e vínculo com propostas |
| **Analytics** | Séries de receita e breakdown de status |
| **Integrações** | Google, GitHub, Stripe, Slack, Notion, WhatsApp |
| **Configurações / Perfil** | Preferências, tema, dados comerciais |
| **Design System** | Catálogo visual em `/design-system` |

Identidade **light enterprise**: papel claro, índigo e dourado Aurea, tipografia limpa, painéis e métricas profissionais.

> Repositório: [github.com/devthomaseduardo/aurea](https://github.com/devthomaseduardo/aurea)

---

## Arquitetura

```
src/
├── app/                    # Bootstrap da aplicação
│   ├── App.tsx
│   ├── providers/          # QueryClient, tema, ErrorBoundary, toasters
│   ├── routes/             # Rotas com lazy loading
│   └── styles/             # Tokens CSS + utilitários de marca
├── core/                   # Infra transversal
│   ├── auth/               # Auth (Firebase + fallback local)
│   ├── firebase/           # App, Auth, Firestore
│   ├── db/                 # useCloudData() — local vs nuvem
│   ├── config/             # APP_CONFIG, ENV, ROUTES
│   ├── storage/            # localStorage tipado por usuário
│   └── hooks/
├── design-system/          # Design System próprio
│   ├── tokens/
│   ├── patterns/           # PageHeader, MetricCard, EmptyState…
│   ├── layouts/            # Dashboard / Landing / Auth
│   └── components/         # BrandLogo…
├── modules/                # Feature modules
│   ├── landing/
│   ├── auth/
│   ├── dashboard/
│   ├── clients/
│   ├── calculator/         # domain + schemas + wizard
│   ├── proposals/
│   ├── contracts/
│   ├── analytics/
│   ├── integrations/
│   ├── settings/
│   ├── profile/
│   └── design-system/
├── services/               # Persistência (local + Firestore)
├── hooks/                  # React Query
├── stores/                 # Zustand (auth, UI, calculator)
├── shared/                 # UI shadcn + utilitários
├── types/
└── assets/brand/
```

### Princípios

- **SOLID / Clean Architecture (front)**: domain isolado (`calculator/domain`), services sem JSX, pages finas, hooks como casos de uso.
- **Component Driven Development**: primitivos (shadcn) → patterns → páginas de módulo.
- **Separação de responsabilidades**: UI ≠ estado ≠ regras de orçamento ≠ persistência.
- **Modularidade**: cada módulo pode crescer com `components/pages/services/hooks/types/schemas`.

### Dados

| Modo | Quando | Onde |
|------|--------|------|
| **Local** | Sem `VITE_FIREBASE_*` (dev/testes) | `localStorage` com prefixo por usuário |
| **Nuvem** | Firebase configurado + usuário logado | **Cloud Firestore** `users/{uid}/…` |

Services são o único ponto de I/O — dual path sync/async, prontos para evoluir sem reescrever a UI.

**Modelo Firestore**

```
users/{uid}                 # perfil
  clients/{id}
  proposals/{id}
  contracts/{id}
  plugins/{pluginId}        # tokens dos conectores
  activities/{id}
```

Rules: [`firestore.rules`](./firestore.rules) — cada usuário só acessa o próprio subtree.

---

## Design System

Acesse em desenvolvimento: **`/design-system`**

### Tokens

- Colors (semantic + brand Aurea)
- Typography
- Spacing, Radius, Border
- Elevation / Shadows
- Tema **claro** (padrão) + **escuro**

### Patterns de alto nível

`PageHeader` · `PageContainer` · `FormSection` · `FormActions` · `SearchBar` · `FilterPanel` · `MetricGrid` · `MetricCard` · `StatCard` · `EmptyState` · `LoadingState` · `StatusBadge` · `DashboardLayout` · `LandingLayout` · `AuthLayout`

### Primitivos

Base shadcn/ui + Radix, com classes de marca (`app-panel`, `feature-icon`, variantes brand).

---

## Módulos

### Calculadora (Wizard)

1. **Informações** — nome, descrição, valor/hora, moeda, regime  
2. **Escopo** — requisitos com complexidade e estimativas  
3. **Tecnologias** — stack + serviços adicionais  
4. **Custos / modelo** — básico · padrão · premium  
5. **Cronograma** — entregas e parcelas  
6. **Resumo** — breakdown, mercado, PDF, salvar proposta/contrato  

Validação por etapa com **Zod** + **React Hook Form**.

### Propostas e contratos

Propostas geradas a partir da calculadora, com status (`draft` → `sent` → `accepted`…), tecnologias, horas, valor, carta/PDF e ações de duplicar/excluir. Contratos vinculados ao pipeline comercial.

### Integrações

Ver seção [Integrações](#integrações).

---

## Autenticação & dados

| Provedor | Uso |
|----------|-----|
| **Firebase Authentication** | E-mail/senha, Google, GitHub |
| **Cloud Firestore** | Dados multi-usuário em produção |
| Fallback local | Demo e testes automatizados sem Firebase |

### Login Google / GitHub

No **login** pedimos apenas identidade (`email` / `profile` ou `read:user` / `user:email`).  
Scopes sensíveis (Gmail, Calendar, `repo`) só na tela **Integrações → Conectar**, para evitar bloqueio de “app não verificado” no Google.

Guia de console (Auth, domains, OAuth, GitHub callback): **[DEPLOY.md](./DEPLOY.md)**.

### Erros comuns

| Código | Causa típica |
|--------|----------------|
| `auth/configuration-not-found` | Authentication não foi iniciado no Firebase (botão **Começar**) |
| App Google não verificado | OAuth em **Testing** sem **usuários de teste** |

---

## Integrações

| Conector | Como conectar | Ação ao vivo |
|----------|---------------|--------------|
| Google Workspace | OAuth popup (Gmail + Calendar) | Enviar e-mail, criar evento |
| GitHub | OAuth / token | Listar repositórios |
| Stripe | Chave `sk_test` / `sk_live` | Payment Link |
| Slack | Incoming Webhook | Mensagem de teste |
| Notion | Token de integração | Página (com `parentPageId`) |
| WhatsApp Business | Webhook / API | Config manual |

Na UI: botão **Testar** valida o conector conectado.

---

## Tecnologias

| Camada | Stack |
|--------|--------|
| UI | React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix |
| Estado | Zustand, TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Routing | React Router v6 (lazy + code splitting) |
| Auth / DB | **Firebase Auth + Firestore** |
| PDF | html2pdf.js |
| Build | Vite 5 + SWC |
| Testes | Vitest + Testing Library |
| Deploy | Vercel / Docker + Nginx |

---

## Instalação

```bash
# Clonar
git clone https://github.com/devthomaseduardo/aurea.git
cd aurea

# Instalar
npm install

# Ambiente
cp .env.example .env.local
# Preencha VITE_FIREBASE_* (ver DEPLOY.md)

# Desenvolvimento (http://localhost:8080)
npm run dev

# Build de produção
npm run build
npm run preview

# Lint e testes
npm run lint
npm test
```

### Variáveis principais

```env
VITE_APP_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=   # opcional
```

### Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Bundle de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm run test` | Testes unitários/integração (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## Docker

```bash
# Build + run
docker compose up --build

# Ou manualmente
docker build -t aurea .
docker run -p 8080:80 aurea
```

Imagem multi-stage (Node 20 → Nginx Alpine) com SPA fallback e gzip.

---

## Deploy & CI/CD

### Vercel (recomendado)

1. Importe o repositório [devthomaseduardo/aurea](https://github.com/devthomaseduardo/aurea)  
2. Framework: **Vite**  
3. Build: `npm run build`  
4. Output: `dist`  
5. Env: todas as `VITE_FIREBASE_*` + `VITE_APP_URL`  

`vercel.json` já faz rewrite SPA.

### Firebase (obrigatório para login real)

Checklist e OAuth: **[DEPLOY.md](./DEPLOY.md)**  
Rules: **[firestore.rules](./firestore.rules)**

### GitHub OAuth App (callback)

```
https://SEU_PROJECT_ID.firebaseapp.com/__/auth/handler
```

Exemplo (projeto `aurea-daa33`):

```
https://aurea-daa33.firebaseapp.com/__/auth/handler
```

---

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing enterprise |
| `/login` · `/register` | Auth (e-mail + social) |
| `/app/dashboard` | Dashboard operacional |
| `/app/clients` | CRUD de clientes |
| `/app/calculator` | Wizard de orçamento |
| `/app/proposals` | Pipeline de propostas |
| `/app/contracts` | Contratos |
| `/app/analytics` | Analytics |
| `/app/integrations` | Plugins e conectores |
| `/app/settings` | Configurações |
| `/app/profile` | Perfil comercial |
| `/design-system` | Documentação visual dos componentes |

---

## Roadmap

### v4.1 (atual)
- [x] Rebrand Aurea (UI light enterprise)
- [x] Auth Firebase (e-mail, Google, GitHub)
- [x] Firestore multi-usuário
- [x] Conectores OAuth / token com teste ao vivo
- [x] Suite de testes + deploy Vercel/Docker

### v4.2
- [ ] Cloud Functions para secrets Stripe / refresh tokens
- [ ] Link público de proposta
- [ ] Exportação PDF com template de marca

### v5.0
- [ ] Multi-workspace / times
- [ ] PWA
- [ ] IA para estimativa de escopo

---

## Testes

Stack: **Vitest** + **Testing Library** + **user-event** + **jsdom** + **coverage-v8**.

```bash
npm test                # suite completa
npm run test:watch      # desenvolvimento
npm run test:coverage   # cobertura (text/html/lcov)
```

### O que a suíte cobre

| Camada | Exemplos |
|--------|----------|
| **Rotas** | Landing, proteção `/app`, 404 |
| **Layouts** | `DashboardLayout` |
| **Patterns** | `PageHeader`, `SearchBar`, `MetricCard`, `EmptyState`… |
| **Landing** | `Hero`, `NavBar` |
| **Wizard** | Steps + `CalculatorPage` |
| **CRUD UI** | `ClientsPage` |
| **Domain/Services** | Orçamento, Zod, clients, proposals, auth local, plugins |

Helpers em `src/test/test-utils.tsx` (`renderWithProviders`).

---

## Qualidade

- Lazy loading + code splitting por rota e vendor chunks  
- Error Boundary global  
- Loading / Empty states  
- React Query para cache e mutações  
- Zustand para UI, auth e wizard  
- Domain de cálculo isolado e testável  
- Mensagens de erro Firebase em português  

### Commits

Mensagens de commit **sempre em português**, no estilo Conventional Commits:

```text
feat: adiciona login com Google via Firebase
fix: corrige erro auth/configuration-not-found na UI
docs: reescreve o README no padrão do projeto
chore: atualiza variáveis de ambiente de exemplo
```

---

## Licença

MIT © Thomas Eduardo

---

<p align="center">
  Desenvolvido com precisão por <strong>Thomas Eduardo</strong> · <strong>Aurea Technologies</strong>
</p>

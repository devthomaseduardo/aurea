<p align="center">
  <img width="1920" height="1440" alt="CalculaFreela" src="https://github.com/user-attachments/assets/bc4fbb09-d4b5-4cbf-b62f-7ebe0fb60005" />
</p>

<h1 align="center">CalculaFreela</h1>

<p align="center">
  <strong>Plataforma SaaS enterprise para freelancers calcularem orçamentos, gerarem propostas e gerenciarem o pipeline comercial.</strong>
</p>

<p align="center">
  <a href="#arquitetura">Arquitetura</a> ·
  <a href="#design-system">Design System</a> ·
  <a href="#módulos">Módulos</a> ·
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
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Version-2.0.0-success" alt="Version"/>
</p>

---

## Visão do produto

O **CalculaFreela** deixou de ser apenas uma calculadora de landing page e passou a ser um **software B2B** real para freelancers:

| Módulo | Capacidade |
|--------|------------|
| **Dashboard** | Receita, clientes, projetos, horas, lucro, gráficos, atividades |
| **Clientes** | CRUD, busca, filtros, ordenação, paginação |
| **Calculadora** | Wizard 6 etapas com validação Zod por step |
| **Propostas** | Persistência, status, PDF/export, duplicar, editar, excluir |
| **Contratos** | Pipeline de status e vínculo com propostas |
| **Analytics** | Séries de receita e breakdown de status |
| **Configurações / Perfil** | Preferências, tema, dados comerciais padrão |
| **Design System** | Storybook interno em `/design-system` |

Identidade visual **Deep Space** preservada: paleta escura, violet-blue, glass cards, gradients e tipografia Inter.

---

## Arquitetura

```
src/
├── app/                    # Bootstrap da aplicação
│   ├── App.tsx
│   ├── providers/          # QueryClient, Tooltip, ErrorBoundary, Toasters
│   ├── routes/             # Rotas com lazy loading
│   └── styles/             # Tokens CSS + utilitários de marca
├── core/                   # Infra transversal
│   ├── config/             # APP_CONFIG, ROUTES
│   ├── storage/            # localStorage tipado
│   └── hooks/
├── design-system/          # Design System próprio
│   ├── tokens/             # Colors, spacing, radius, elevation…
│   ├── patterns/           # PageHeader, MetricCard, EmptyState…
│   └── layouts/            # Dashboard / Landing / Auth
├── modules/                # Feature modules (Clean Architecture light)
│   ├── landing/
│   ├── dashboard/
│   ├── clients/
│   ├── calculator/         # domain + schemas + wizard steps
│   ├── proposals/
│   ├── contracts/
│   ├── analytics/
│   ├── settings/
│   ├── profile/
│   └── design-system/
├── services/               # Regras de persistência / API-ready
├── hooks/                  # React Query hooks reutilizáveis
├── stores/                 # Zustand (UI + Calculator)
├── shared/                 # UI shadcn + utilitários
├── types/                  # Domain types
└── assets/
```

### Princípios

- **SOLID / Clean Architecture (front)**: domain isolado (`calculator/domain`), services sem JSX, pages finas, hooks como casos de uso.
- **Component Driven Development**: primitivos (shadcn) → patterns → páginas de módulo.
- **Separação de responsabilidades**: UI ≠ estado ≠ regras de orçamento ≠ persistência.
- **Modularidade**: cada módulo pode crescer com `components/pages/services/hooks/types/schemas/utils/routes`.

### Dados

Persistência **local-first** via `localStorage` (`cf_v2:*`), com seeds realistas. Services são o único ponto de I/O — prontos para trocar por API REST/GraphQL sem reescrever UI.

---

## Design System

Acesse em desenvolvimento: **`/design-system`**

### Tokens

- Colors (semantic + brand)
- Typography (Inter scale)
- Spacing, Radius, Border
- Elevation / Shadows
- Animations & Transitions
- Breakpoints, Grid, Container
- Icon sizes, Z-index
- **Dark theme** (default) + **Light theme** preparado (`.light`)

### Patterns de alto nível

`PageHeader` · `PageContainer` · `FormSection` · `FormGroup` · `FormActions` · `SearchBar` · `FilterPanel` · `MetricGrid` · `MetricCard` · `StatCard` · `EmptyState` · `LoadingState` · `StatusBadge` · `DashboardLayout` · `LandingLayout` · `AuthLayout`

### Primitivos

Base shadcn/ui + Radix, estendidos com variantes e classes de marca (`btn-primary`, `glass-card`, `gradient-text`, `badge-pill`).

---

## Módulos

### Calculadora (Wizard)

1. **Informações** — nome, descrição, valor/hora, moeda, regime, buffer  
2. **Escopo** — requisitos com complexidade e estimativas  
3. **Tecnologias** — stack + serviços adicionais  
4. **Custos** — modelo básico/padrão/premium + partes do contrato  
5. **Cronograma** — entregas e parcelas automáticas  
6. **Resumo** — breakdown, mercado, PDF, salvar proposta/contrato  

Validação por etapa com **Zod** + **React Hook Form**.

### Propostas

Geradas a partir da calculadora, com status (`draft` → `sent` → `accepted`…), tecnologias, horas, valor, exportação de carta/contrato e ações de duplicar/excluir.

---

## Tecnologias

| Camada | Stack |
|--------|--------|
| UI | React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix |
| Estado | Zustand, React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Routing | React Router v6 (lazy + code splitting) |
| PDF | html2pdf.js |
| Build | Vite 5 + SWC |
| Deploy | Vercel / Docker + Nginx |

---

## Instalação

```bash
# Clonar
git clone https://github.com/devthomaseduardo/fulstack-analisador-freelancer.git
cd fulstack-analisador-freelancer

# Instalar
npm install

# Desenvolvimento (http://localhost:8080)
npm run dev

# Build de produção
npm run build
npm run preview

# Lint
npm run lint
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
docker build -t calculafreela .
docker run -p 8080:80 calculafreela
```

A imagem usa **multi-stage build** (Node 20 → Nginx Alpine) com SPA fallback e gzip.

---

## Deploy & CI/CD

### Vercel (recomendado)

1. Importe o repositório no Vercel  
2. Framework preset: **Vite**  
3. Build command: `npm run build`  
4. Output: `dist`  

### CI

Workflow GitHub Actions em `.github/workflows/ci.yml`:

- `npm ci`
- `npm run lint`
- `npm run build`

Roda em push/PR para `main`.

---

## Screenshots / rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing premium |
| `/app/dashboard` | Dashboard operacional |
| `/app/clients` | CRUD de clientes |
| `/app/calculator` | Wizard de orçamento |
| `/app/proposals` | Pipeline de propostas |
| `/app/contracts` | Contratos |
| `/app/analytics` | Analytics |
| `/app/settings` | Configurações |
| `/app/profile` | Perfil comercial |
| `/design-system` | Documentação visual dos componentes |

---

## Roadmap

### v2.1
- [ ] Autenticação (Clerk / Auth0)
- [ ] Backend API + Postgres
- [ ] Exportação PDF branded com template visual
- [ ] Compartilhamento de proposta via link público

### v2.2
- [ ] Integração Stripe / Asaas para cobrança
- [ ] Templates de proposta customizáveis
- [ ] Multi-workspace / time

### v3.0
- [ ] App mobile (PWA)
- [ ] IA para estimativa de escopo
- [ ] Marketplace de templates

---

## Testes (foco frontend)

Stack: **Vitest** + **Testing Library** + **user-event** + **jsdom** + **coverage-v8**.

```bash
npm run test            # suite completa (~100 testes)
npm run test:watch      # desenvolvimento
npm run test:coverage   # cobertura (text/html/lcov)
```

### O que a suíte cobre no frontend

| Camada UI | Exemplos |
|-----------|----------|
| **Rotas** | Landing, Dashboard shell, Calculadora, 404 |
| **Layouts** | `DashboardLayout` (sidebar + outlet) |
| **Patterns** | `PageHeader`, `SearchBar`, `MetricCard`, `EmptyState`, `FormSection`… |
| **Landing** | `Hero`, `NavBar`, CTAs e links |
| **Wizard** | `StepInfo` / `StepEscopo` (validação + interação), `CalculatorPage` + demo |
| **CRUD UI** | `ClientsPage` (lista seed + busca) |
| **Domain/Services** | Orçamento, Zod, persistência local (suporte à UI) |

Helpers em `src/test/test-utils.tsx` (`renderWithProviders` com Router + React Query + Tooltip).

Os testes rodam no CI (GitHub Actions) antes do build.

## Qualidade

- Lazy loading + code splitting por rota e vendor chunks  
- Error Boundary global  
- Loading / Skeleton / Empty states  
- React Query para cache e mutações  
- Zustand para UI e wizard  
- Componentes preferencialmente < 200 linhas  
- Domain de cálculo isolado e testável  
- Suite automatizada com 70+ testes

---

## Licença

MIT © Thomas Eduardo

---

<p align="center">
  Desenvolvido com precisão por <strong>Thomas Eduardo</strong>
</p>

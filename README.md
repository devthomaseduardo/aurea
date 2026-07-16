# Aurea

**Plataforma comercial empresarial** para freelancers, consultores e times independentes.

Precifique projetos, gere propostas profissionais, gerencie clientes e contratos, e conecte ferramentas do dia a dia — com login real e dados isolados por usuário.

| | |
|---|---|
| **Produto** | Aurea Enterprise |
| **Versão** | 4.1 |
| **Stack** | React · Vite · TypeScript · Firebase · Tailwind |
| **Repositório** | [github.com/devthomaseduardo/aurea](https://github.com/devthomaseduardo/aurea) |

---

## O que é a Aurea

Aurea unifica o fluxo comercial de quem vende serviço:

1. **Calcular** o valor de um projeto (escopo, horas, tecnologias, margem)
2. **Propor** com carta de proposta e PDF
3. **Gerir** clientes, pipeline e contratos
4. **Conectar** Google, GitHub, Stripe, Slack e outros

Não é só uma calculadora: é um **SaaS multi-usuário** com autenticação Firebase e banco Firestore.

---

## Funcionalidades

### Comercial
- Calculadora de orçamento em wizard (informações → escopo → tecnologias → resumo)
- Propostas com status (rascunho, enviada, aceita, etc.)
- Contratos gerados a partir de propostas
- CRM leve de clientes (lead / ativo / inativo)
- Dashboard e analytics

### Conta e multi-usuário
- Login com **e-mail/senha**, **Google** e **GitHub**
- Dados por usuário em Firestore: `users/{uid}/…`
- Perfil, preferências e isolamento de workspace

### Integrações (plugins)
| Conector | Como funciona |
|----------|----------------|
| Google Workspace | OAuth (Gmail send + Calendar events) na tela Integrações |
| GitHub | OAuth / token para repositórios |
| Stripe | Payment Links com chave `sk_…` |
| Slack | Incoming Webhook |
| Notion | Integration token |
| WhatsApp Business | Webhook / Cloud API |

Login social pede só identidade (e-mail/perfil). Scopes sensíveis (Gmail, Calendar, repo) só ao **Conectar** o plugin.

### UI
- Design system light enterprise (tokens, layouts, patterns)
- Tema claro/escuro
- Landing page + app autenticado

---

## Stack técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18, Vite 5, TypeScript |
| Estilo | Tailwind CSS, Radix UI, shadcn-style components |
| Estado | Zustand, TanStack Query |
| Auth | **Firebase Authentication** |
| Database | **Cloud Firestore** (por `uid`) |
| Hosting sugerido | Vercel (SPA) ou Firebase Hosting |
| Testes | Vitest + Testing Library |

> **Sem Supabase.** Produção = Firebase Auth + Firestore.

---

## Início rápido

### Pré-requisitos
- Node.js 20+
- Conta [Firebase](https://console.firebase.google.com) (projeto ex.: `aurea-daa33`)

### Instalação

```bash
git clone https://github.com/devthomaseduardo/aurea.git
cd aurea
npm install
cp .env.example .env.local
```

Preencha o `.env.local` com a config do app Web no Firebase:

```env
VITE_APP_URL=http://localhost:8080

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# opcional
VITE_FIREBASE_MEASUREMENT_ID=
```

### Desenvolvimento

```bash
npm run dev
# → http://localhost:8080
```

Sem `VITE_FIREBASE_*`, o app roda em **modo local** (localStorage) para demos e testes.  
Com Firebase configurado, login e dados vão para a nuvem.

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (`dist/`) |
| `npm run preview` | Preview do build |
| `npm test` | Suite Vitest |
| `npm run test:watch` | Testes em watch |
| `npm run lint` | ESLint |

---

## Produção (go-live)

Guia completo: **[DEPLOY.md](./DEPLOY.md)**

Checklist resumido:

1. Firebase → **Authentication** → Começar → Email + Google (+ GitHub)
2. Firestore → criar DB + publicar [`firestore.rules`](./firestore.rules)
3. OAuth consent (Google Cloud) → **Testing** + **usuários de teste**
4. Domínios autorizados: `localhost` + domínio de produção
5. Variáveis `VITE_FIREBASE_*` na Vercel
6. Deploy (`vercel` ou pipeline)

```bash
npm run build
# output: dist/
```

`vercel.json` já configura rewrite SPA.

---

## Arquitetura (visão)

```
src/
  app/                 # App shell, rotas, providers
  core/
    auth/              # Auth service (Firebase + fallback local)
    firebase/          # App, Auth, Firestore
    db/                # useCloudData() — local vs cloud
    config/            # ENV, APP_CONFIG, rotas
  modules/             # Domínios de produto
    auth/ calculator/ clients/ proposals/
    contracts/ dashboard/ integrations/ landing/ …
  services/            # Clientes, propostas, plugins, etc.
  design-system/       # Layouts, patterns, tokens
  stores/              # Zustand
```

**Modelo Firestore**

```
users/{uid}                    # profile
  clients/{id}
  proposals/{id}
  contracts/{id}
  plugins/{pluginId}           # tokens de conectores
  activities/{id}
```

---

## Firebase (projeto de referência)

| Campo | Exemplo |
|-------|---------|
| Nome | aurea |
| Project ID | `aurea-daa33` |
| Auth domain | `aurea-daa33.firebaseapp.com` |
| GitHub OAuth callback | `https://aurea-daa33.firebaseapp.com/__/auth/handler` |

Detalhes de OAuth Google “app não verificado”, scopes e conectores: ver [DEPLOY.md](./DEPLOY.md).

---

## Estrutura de marca

```
public/brand/
  logo.png
  logo-mark.jpg
  hero.jpg
  product.jpg
  pattern.jpg
```

Nome legal / produto: **Aurea Technologies** · **Aurea Enterprise**  
Config central: `src/core/config/app.config.ts`

---

## Testes

```bash
npm test
```

Cobertura inclui domínio da calculadora, serviços, auth local, componentes de UI e rotas.

---

## Contribuindo

1. Fork / branch a partir de `main`
2. `npm install && npm test`
3. PR com descrição clara do que mudou e por quê

---

## Licença

Projeto privado / uso conforme o repositório GitHub. Ajuste a licença se for publicar open source.

---

## Links

- [Deploy e produção](./DEPLOY.md)
- [Firestore rules](./firestore.rules)
- [Firebase Console](https://console.firebase.google.com/project/aurea-daa33)
- [Repositório](https://github.com/devthomaseduardo/aurea)

---

<p align="center">
  <strong>Aurea</strong> — operação comercial com padrão enterprise.
</p>

# Áurea

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Plataforma comercial B2B para **precificar projetos**, gerar **propostas**, gerir **clientes/contratos** e operar o pipeline de freelancers e consultores. Identidade light enterprise (índigo + dourado).

Autor: [Thomas Eduardo](https://thomaseduardo.com.br) · [Portfólio](https://thomaseduardo.com.br/projetos/aurea) · [GitHub](https://github.com/devthomaseduardo/aurea)

## Propósito

- **Operação comercial:** sair de planilhas para um SaaS com orçamento, proposta e histórico por cliente.
- **Demo e produção:** modo **local** (localStorage) sem Firebase; modo **nuvem** com Auth + Firestore.
- **Integrações:** Google, GitHub, Stripe, Slack, Notion, WhatsApp (conectores com teste na UI).

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Dashboard** | Receita, clientes, horas, lucro, atividades |
| **Clientes** | CRUD, busca, filtros, paginação |
| **Calculadora** | Wizard multi-etapas (Zod + RHF) |
| **Propostas** | Status, PDF, duplicar, editar |
| **Contratos** | Pipeline vinculado a propostas |
| **Analytics** | Séries e breakdown de status |
| **Integrações** | OAuth / token + botão Testar |
| **Design System** | Catálogo em `/design-system` |

## Autenticação e dados

| Provedor | Uso |
|----------|-----|
| **Firebase Auth** | E-mail/senha, Google, GitHub |
| **Cloud Firestore** | `users/{uid}/…` multi-usuário |
| **Local** | Sem `VITE_FIREBASE_*` — demo e testes |

Rotas principais: `/`, `/login`, `/register`, `/app/dashboard`, `/app/clients`, `/app/calculator`, `/app/proposals`, `/app/contracts`, `/app/analytics`, `/app/integrations`, `/app/settings`, `/app/profile`.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Linguagem | **TypeScript** |
| UI | **React 18**, **React Router 6** |
| Build | **Vite 5** + SWC |
| Estilo | **Tailwind**, shadcn/Radix |
| Estado | **Zustand**, **TanStack Query** |
| Forms | **react-hook-form**, **Zod** |
| Auth / DB | **Firebase Auth + Firestore** |
| PDF | **html2pdf.js** |
| Testes | **Vitest** + Testing Library |
| Deploy | **Vercel** / Docker + Nginx |

## Requisitos

- **Node.js** 18+
- Firebase opcional (ver [DEPLOY.md](./DEPLOY.md) e `.env.example`)

## Instalação

```bash
git clone https://github.com/devthomaseduardo/aurea.git
cd aurea
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

| Comando | Efeito |
|---------|--------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Produção (`dist/`) |
| `npm run preview` | Preview |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run test:coverage` | Cobertura |

## Deploy

Vercel: framework Vite, output `dist`, env `VITE_FIREBASE_*` + `VITE_APP_URL`. `vercel.json` com rewrite SPA.

Firestore rules: [`firestore.rules`](./firestore.rules).

## Licença

MIT © Thomas Eduardo

# Áurea

Plataforma comercial B2B para **precificar projetos**, gerar **propostas**, gerir **clientes/contratos** e operar o pipeline de freelancers e consultores.

```text
Cliente → Precificação → Proposta → Contrato → Resultado
```

**Autor:** [Thomas Eduardo](https://thomaseduardo.com.br)  
**Portfólio:** [thomaseduardo.com.br](https://thomaseduardo.com.br)  
**Repositório:** [github.com/devthomaseduardo/aurea](https://github.com/devthomaseduardo/aurea)

---

## O que é (e o que não é)

| É | Não é |
|---|---|
| SaaS comercial de serviços profissionais | ERP, PDV ou estoque |
| Precificação + proposta + contrato | Sistema de ordem de serviço |
| Workspace para freelancers e pequenas agências | CRM enterprise completo |

Identidade visual: light enterprise (indigo + dourado).

---

## Funcionalidades

| Módulo | Responsabilidade |
|--------|------------------|
| **Dashboard** | Receita, clientes, horas, lucro, atividades |
| **Clientes** | CRUD, busca, filtros, paginação |
| **Calculadora** | Wizard multi-etapas (Zod + RHF) |
| **Propostas** | Status, PDF, duplicar, editar |
| **Contratos** | Pipeline vinculado a propostas |
| **Analytics** | Séries e breakdown de status |
| **Integrações** | Google, GitHub, Stripe, Slack, Notion, WhatsApp |
| **Design System** | Catálogo em `/design-system` |

### Rotas principais

```text
/
/login
/register
/app/dashboard
/app/clients
/app/calculator
/app/proposals
/app/contracts
/app/analytics
/app/integrations
/app/settings
/app/profile
```

---

## Quick Start

```bash
git clone https://github.com/devthomaseduardo/aurea.git
cd aurea
npm install
cp .env.example .env.local
npm run dev
```

Validações:

```bash
npm run lint
npm test
npm run build
```

### Modos de dados

| Modo | Comportamento |
|------|---------------|
| **Local** | Dados de demonstração no `localStorage` (sem Firebase) |
| **Nuvem** | Firebase Auth + Firestore por usuário |

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Linguagem | TypeScript |
| UI | React 18 · React Router 6 · Vite 5 |
| Estilo | Tailwind · shadcn/Radix |
| Estado | Zustand · TanStack Query |
| Forms | react-hook-form · Zod |
| Auth / DB | Firebase Auth + Firestore |
| PDF | html2pdf.js |
| Testes | Vitest + Testing Library |
| Deploy | Vercel / Docker + Nginx |

---

## Direção de produto

Novas funcionalidades devem responder a pelo menos uma destas perguntas:

- Ajuda a precificar melhor?
- Ajuda a organizar o relacionamento com o cliente?
- Ajuda a transformar orçamento em proposta?
- Ajuda a fechar ou acompanhar um contrato?
- Ajuda a entender o desempenho comercial?

---

## Requisitos

- Node.js 18+
- Firebase opcional (ver `.env.example`)

## Licença

**Software proprietário.** Todos os direitos reservados.

Ver [LICENSE](LICENSE). Uso, cópia, modificação ou distribuição sem autorização escrita prévia é proibido.

Contato: [thomaseduardo.com.br](https://thomaseduardo.com.br)

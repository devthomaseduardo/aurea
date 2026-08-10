# Áurea

Plataforma comercial B2B para freelancers, consultores e pequenas agências que precisam transformar escopo em preço, preço em proposta e proposta em contrato sem depender de planilhas espalhadas.

Autor: Thomas Eduardo

## Ideia do produto

O Áurea não é ERP, PDV, estoque ou sistema de ordem de serviço. O produto acompanha um fluxo comercial de serviços profissionais:

`Cliente → Precificação → Proposta → Contrato → Resultado`

A interface e os módulos principais devem reforçar esse caminho.

## Fluxo principal

1. Cadastre ou selecione um cliente.
2. Estruture o escopo e faça a precificação do projeto.
3. Gere uma proposta a partir do orçamento.
4. Acompanhe envio, visualização e aceite.
5. Formalize o fechamento em contrato.
6. Acompanhe receita, pipeline e taxa de aceite no dashboard.

## Módulos

| Módulo | Responsabilidade |
| --- | --- |
| Visão geral | Receita contratada, clientes, propostas em aberto e taxa de aceite |
| Clientes | Cadastro e histórico do relacionamento comercial |
| Precificação | Escopo, horas, custos, margem e valor recomendado |
| Propostas | Geração, acompanhamento de status e PDF |
| Contratos | Formalização dos projetos fechados |
| Resultados | Evolução comercial e indicadores do funil |
| Integrações | Conexões complementares do workspace |
| Configurações | Preferências do profissional ou empresa |

## Rotas principais

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

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/Radix
- Zustand
- TanStack Query
- react-hook-form + Zod
- Firebase Auth + Firestore
- Vitest + Testing Library

## Dados

O projeto pode trabalhar em dois modos:

- Local: dados de demonstração persistidos no navegador.
- Nuvem: Firebase Auth e Firestore por usuário.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Validações disponíveis:

```bash
npm run lint
npm test
npm run build
```

## Direção de produto

Novas funcionalidades devem responder a pelo menos uma destas perguntas:

- Ajuda a precificar melhor?
- Ajuda a organizar o relacionamento com o cliente?
- Ajuda a transformar orçamento em proposta?
- Ajuda a fechar ou acompanhar um contrato?
- Ajuda a entender o desempenho comercial?

Se não reforçar esse fluxo, a funcionalidade provavelmente não pertence ao núcleo do Áurea.

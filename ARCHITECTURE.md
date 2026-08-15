# Arquitetura da Áurea

## Visão geral

A Áurea é uma aplicação React + TypeScript orientada ao fluxo comercial de serviços profissionais. A arquitetura separa composição da aplicação, regras de domínio, módulos de negócio, infraestrutura e elementos reutilizáveis de interface.

```text
UI / rotas
   ↓
módulos de negócio
   ↓
core / regras
   ↓
services / integrações
   ↓
Firebase e serviços externos
```

O fluxo central do produto é:

```text
Cliente → Precificação → Proposta → Contrato → Resultado
```

## Estrutura principal

```text
src/
  app/             composição da aplicação e rotas
  core/            regras e conceitos centrais do domínio
  design-system/   componentes e padrões visuais próprios
  hooks/           comportamento reutilizável de React
  lib/             utilitários e adaptadores de baixo nível
  modules/         funcionalidades organizadas por domínio
  services/        acesso a serviços externos e persistência
  shared/          código compartilhado entre módulos
  stores/          estado global da aplicação
  test/            configuração e utilitários de teste
  types/           contratos TypeScript compartilhados
apps/
  api/             superfície de API separada da aplicação web
```

## Responsabilidades por camada

### `src/app`

Concentra a montagem da aplicação. Rotas, providers e composição de páginas devem depender dos módulos e não carregar regras comerciais complexas diretamente.

### `src/modules`

É a principal fronteira funcional. Código específico de clientes, precificação, propostas, contratos, analytics e integrações deve permanecer próximo do domínio que representa.

### `src/core`

Abriga regras que não deveriam depender da interface. Cálculos, invariantes e transformações centrais devem ser preferencialmente testáveis sem renderizar React.

### `src/services`

Centraliza comunicação com Firebase e integrações externas. Componentes não devem conhecer detalhes de SDK, credenciais ou formato de transporte quando um serviço pode expor uma interface menor e mais estável.

### `src/stores`

Mantém estado compartilhado. Estado local de tela deve continuar local; somente informações usadas por múltiplas áreas devem subir para uma store global.

### `src/design-system` e `src/shared`

`design-system` representa decisões visuais e componentes de produto. `shared` concentra código realmente transversal. Um componente específico de proposta, contrato ou cliente deve permanecer no respectivo módulo em vez de ser promovido cedo demais para `shared`.

## Dados e autenticação

A aplicação suporta execução local com dados de demonstração e execução conectada ao Firebase. No modo conectado, autenticação e persistência devem manter os dados associados ao usuário autenticado.

A interface deve consumir essa diferença por meio de serviços e contratos estáveis, evitando espalhar verificações de ambiente por páginas e componentes.

## Estado e acesso a dados

A separação esperada é:

```text
componente
   ↓
hook / store
   ↓
service
   ↓
Firebase ou fonte local
```

TanStack Query deve cuidar de estado assíncrono de servidor quando aplicável. Zustand deve ser reservado a estado compartilhado de aplicação. Misturar os dois para representar a mesma informação cria duas fontes de verdade.

## Validação

Antes de considerar uma alteração pronta:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

O atalho equivalente é:

```bash
npm run validate
```

## Regras de evolução

1. Regra de negócio não deve nascer dentro de componente visual quando puder ser uma função ou serviço testável.
2. Integração externa deve ter uma fronteira clara em `services` ou na API.
3. Estado global só deve existir quando houver consumo real em mais de uma área.
4. Um módulo pode usar elementos compartilhados, mas não deve acessar detalhes internos de outro módulo sem um contrato explícito.
5. Novas funcionalidades devem preservar o fluxo Cliente → Precificação → Proposta → Contrato em vez de criar fluxos paralelos sem necessidade.
6. Toda mudança estrutural deve continuar passando por lint, TypeScript, testes e build.

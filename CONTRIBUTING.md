# Contribuindo — Aurea

## Commits

Todas as mensagens de commit devem ser **em português**, usando Conventional Commits:

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação (README, DEPLOY, etc.) |
| `style:` | Formatação sem mudar lógica |
| `refactor:` | Refatoração sem mudar comportamento |
| `test:` | Testes |
| `chore:` | Build, deps, configs |

### Exemplos

```text
feat: adiciona conector Slack com webhook
fix: mapeia erros do Firebase Auth em português
docs: atualiza checklist de go-live no DEPLOY.md
chore: remove dependência do Supabase
```

### Evitar

- Mensagens só em inglês (`feat: add login`)
- Mensagens vagas (`update`, `fix stuff`, `wip`)

## README e docs

Seguir o padrão visual do `README.md` do repositório:

- Hero / logo centralizado
- Título e tagline em português
- Âncoras de navegação
- Badges de stack
- Seções: Visão, Arquitetura, Design System, Módulos, Tecnologias, Instalação, Docker, Deploy, Roadmap, Testes, Qualidade
- Links para `DEPLOY.md` e `firestore.rules` quando for produção

## Código

- TypeScript estrito
- Services sem JSX; UI sem I/O direto de banco
- Dual path local / Firestore quando tocar em dados de usuário
- Testes com Vitest para domínio e fluxos críticos

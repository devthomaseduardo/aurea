# Aurea — Go-live (produção)

Stack de produção (**sem Supabase**):

| Camada | Tecnologia |
|--------|------------|
| Frontend | Vite + React + TypeScript |
| Auth | **Firebase Authentication** (Google, GitHub, e-mail/senha) |
| Database | **Cloud Firestore** — dados isolados por `users/{uid}/…` |
| Hosting | Vercel (SPA rewrite em `vercel.json`) |
| Conectores | OAuth real (Google/GitHub) + tokens (Stripe/Slack/Notion) |

---

## 1. Firebase (obrigatório para login real multi-usuário)

1. [Firebase Console](https://console.firebase.google.com) → projeto **aurea** (`aurea-daa33`)
2. **Authentication** (menu esquerdo)
   - Se aparecer **Começar / Get started**, clique — isso **ativa** o Auth no projeto  
   - Sem este passo o app retorna `auth/configuration-not-found`
3. **Authentication → Sign-in method**
   - **Email/Password** → Enable → Save  
   - **Google** → Enable → escolha e-mail de suporte → Save  
   - **GitHub** → Enable (Client ID/Secret do [GitHub OAuth Apps](https://github.com/settings/developers))
4. **Firestore Database → Create database**
   - Production mode
   - Publique as rules de `firestore.rules` deste repositório
5. **Project settings → Your apps → Web**
   - Copie `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
6. **Authentication → Settings → Authorized domains**
   - `localhost`
   - domínio Vercel (`seu-app.vercel.app`) e domínio custom se houver

### Erro `auth/configuration-not-found`

Causa: Authentication ainda não foi inicializado no projeto (só criar o app Web não basta).

Solução: Console → **Authentication** → **Começar** → ative **Email/senha** (e Google se for usar social) → tente login de novo.

### GitHub OAuth App

- Homepage: `https://seu-dominio.vercel.app`
- Authorization callback URL:  
  `https://YOUR_PROJECT.firebaseapp.com/__/auth/handler`

### Google Cloud (Gmail + Calendar funcionando)

No mesmo projeto Google Cloud:

1. APIs & Services → Enable **Gmail API** e **Google Calendar API**
2. OAuth consent screen → External → scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/calendar.events`
3. Enquanto em *Testing*, adicione test users

---

## 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha **todos** os `VITE_FIREBASE_*`.

Na Vercel: **Project → Settings → Environment Variables** (Production + Preview).

| Variável | Obrigatória |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | sim |
| `VITE_FIREBASE_AUTH_DOMAIN` | sim |
| `VITE_FIREBASE_PROJECT_ID` | sim |
| `VITE_FIREBASE_STORAGE_BUCKET` | recomendado |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | recomendado |
| `VITE_FIREBASE_APP_ID` | sim |
| `VITE_APP_URL` | sim (URL pública) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | opcional |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | opcional |
| `VITE_GITHUB_OAUTH_CLIENT_ID` | opcional |

Sem `VITE_FIREBASE_*` o app roda em **modo local** (localStorage) — útil para dev/testes, **não** para multi-usuário real.

---

## 3. Deploy Vercel

```bash
npm i -g vercel
vercel
# ou conecte o repo no dashboard
```

- Framework: Vite  
- Build: `npm run build`  
- Output: `dist`  
- `vercel.json` já faz rewrite SPA (`/* → /index.html`)

---

## 4. O que funciona em produção

| Ação | Como |
|------|------|
| Login e-mail/senha | Firebase Auth |
| Login Google / GitHub | Popup Firebase + scopes |
| Dados isolados por usuário | Firestore `users/{uid}/clients\|proposals\|contracts\|plugins\|activities` |
| Google Workspace | Login social ou **Integrações → Conectar** (Gmail send + Calendar events) |
| Enviar e-mail | `pluginsService.sendGmail` |
| Evento no Calendar | `pluginsService.createCalendarEvent` |
| GitHub repos | `pluginsService.listGithubRepos` |
| Stripe Payment Link | Conectar `sk_test_…` / `sk_live_…` → `createStripePaymentLink` |
| Slack | Incoming Webhook URL |
| Notion | Integration token (+ `parentPageId` no config) |
| Testar conector | Botão **Testar** na página de Integrações |

---

## 5. Checklist go-live

- [ ] Firebase Auth: Google + GitHub + Email
- [ ] Firestore rules publicadas (`firestore.rules`)
- [ ] Gmail API + Calendar API ligadas
- [ ] Domínios autorizados no Firebase
- [ ] Env vars na Vercel
- [ ] Deploy + teste de login social em produção
- [ ] Teste: conectar Google Workspace e enviar e-mail
- [ ] Teste: conectar GitHub e listar repos (botão Testar)
- [ ] Teste: criar cliente/proposta logado (dados no Firestore)

---

## 6. Segurança

- Tokens OAuth e secrets de plugins ficam em Firestore **somente do próprio uid** (rules).
- Nunca commite `.env.local`.
- Em produção madura, mova `sk_live` Stripe e refresh tokens para Cloud Functions / backend.

---

## 7. Modelo de dados (Firestore)

```
users/{uid}                 # profile embutido
  clients/{id}
  proposals/{id}
  contracts/{id}
  plugins/{pluginId}        # tokens por conector
  activities/{id}
```

Cada usuário só acessa o próprio subtree.

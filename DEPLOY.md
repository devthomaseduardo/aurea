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

### Google Cloud (OAuth + Gmail/Calendar)

No [Google Cloud Console](https://console.cloud.google.com) do projeto ligado ao Firebase:

1. **APIs & Services → Enabled APIs** → ative **Gmail API** e **Google Calendar API** (só se for usar conectores)
2. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name: `Aurea`, e-mail de suporte
   - Publishing status: **Testing** (ok em desenvolvimento)
3. **Test users** (obrigatório em Testing): adicione o Gmail de cada pessoa que vai logar  
   - Sem isso o Google mostra “app não verificado” e pode bloquear
4. **Scopes no login** do Aurea: só `email` + `profile` (não pede Gmail no login)
5. **Scopes dos conectores** (Integrações → Google Workspace):
   - `gmail.send`
   - `calendar.events`  
   → em Testing só **test users** conseguem autorizar; para o público, precisa **Verification** da Google (demorado)

#### “Google não verificou este app”

Normal em apps novos. Durante desenvolvimento:

1. OAuth consent → **Testing**
2. Adicione seu e-mail em **Test users**
3. Na tela de aviso: **Avançado** → **Ir para Aurea (não seguro)**  
   (só aparece se você for test user)

Não use scopes de Gmail/Calendar no login — o Aurea pede isso só ao **Conectar** o plugin.

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

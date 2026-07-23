# EasyBox Platform

Sistema SaaS multi-tenant de gestão para a indústria brasileira de papelão ondulado: cadastros, orçamentos com motor de cálculo McKee + catálogo FEFCO, desenvolvimento (clichê/faca/processo), produção e segurança. Monorepo com backend (API) e frontend (web).

## Stack

- **Monorepo**: npm workspaces (`backend`, `frontend`) — raiz orquestra ambos.
- **Backend** (`backend/`): Node.js 22, ESM (`"type": "module"`), Express 4, Drizzle ORM + `@neondatabase/serverless` (Neon PostgreSQL), JWT (`jsonwebtoken`) + `bcryptjs`, validação `joi`, `helmet`/`cors`/`express-rate-limit`, `winston`, `multer`+`sharp`, `pdf-lib`, `node-cron`, `whatsapp-web.js`. Entry: `src/server.js`.
- **Frontend** (`frontend/`): Next.js 14 (App Router) + React 18 + TypeScript 5, Tailwind CSS 3, `react-query`, `zustand`, `react-hook-form`+`zod`, `three` / `@react-three/fiber`+`drei` (visualização 3D de caixas), `recharts`, `framer-motion`, `axios`.
- **Deploy**: backend na **Railway** (`Procfile`, `start.sh`, `.railwayignore`, `.buildpacks`); frontend na **Vercel**.
- **Package manager**: npm (`package-lock.json` na raiz e em cada workspace).

## Comandos

Na raiz:

```bash
npm run install:all     # instala raiz + backend + frontend
npm run dev             # concurrently: backend dev + frontend dev
npm run dev:backend     # só backend (nodemon)
npm run dev:frontend    # só frontend (next dev)
npm run build           # build do frontend (next build)
npm run build:backend   # build do backend (no-op: echo)
npm start               # inicia o backend (node src/server.js)
```

Backend (`cd backend`):

```bash
npm run dev        # nodemon src/server.js
npm start          # node src/server.js
npm test           # jest
npm run lint       # eslint src/
npm run db:migrate # node src/database/migrate.js
npm run db:seed    # node src/database/seed.js
```

Frontend (`cd frontend`):

```bash
npm run dev        # next dev
npm run build      # next build
npm start          # next start
npm run lint       # next lint
npm run type-check # tsc --noEmit
```

## Estrutura

```
backend/src/
├── server.js       # entry Express
├── routes/         # rotas da API
├── controllers/    # handlers
├── services/       # regras de negócio (McKee, FEFCO, etc.)
├── middleware/     # auth, rate limit, erros
├── database/       # Drizzle schema/config + migrate.js + seed.js
└── data/           # dados de referência (catálogo FEFCO, tabelas)
frontend/src/
├── app/            # App Router (páginas dos módulos)
├── components/     # UI, inclusive visualização 3D (three)
└── hooks/          # hooks (ex.: data fetching com react-query)
```

Docs de deploy no repo: `DEPLOYMENT.md`, `RAILWAY_SETUP.md`, `RAILWAY_ENV_SETUP.md`, `VERCEL_SETUP.md`, `QUICK_DEPLOY_GUIDE.md`.

## Convenções de código

- **Backend em ESM** — use `import`/`export`, não `require`. Node 22 fixado em `engines`.
- Validação de payloads com `joi` no backend; no frontend, `zod` + `react-hook-form`.
- Estado de servidor no frontend via `react-query`; estado global leve via `zustand`.
- Segurança de API sempre com `helmet`, `cors` e `express-rate-limit`.
- ESLint em ambos os workspaces (`npm run lint`); `type-check` no frontend antes de PR.
- Cálculos de engenharia (McKee/BCT, dimensões FEFCO) vivem em `backend/src/services` — mantê-los testados e sem duplicação no frontend.

## Variáveis de ambiente

Nomes (nunca valores). Base em `.env.example`:

- **Backend**: `DATABASE_URL` (Neon), `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URL`. Configurar na Railway (ver `RAILWAY_ENV_SETUP.md`).
- **Frontend**: `NEXT_PUBLIC_API_URL` (usado no build/CI e em runtime para apontar à API). Configurar na Vercel (ver `VERCEL_SETUP.md`).

Multi-tenant: dados isolados por tenant no Neon — nunca vazar `tenant_id` entre requisições.

## CI/CD & Deploy

- **GitHub Actions** (`.github/workflows/deploy.yml`), em push para `main`/`develop` e PRs para `main`:
  - `test-backend`: Node 18, `npm ci` no backend, `npm run lint || true`, `npm test || true`.
  - `test-frontend`: Node 18, `npm ci`, `npm run lint || true`, `npm run type-check || true`, `npm run build` (com `NEXT_PUBLIC_API_URL` placeholder).
  - `notify-deployment`: só na `main`, apenas ecoa mensagem.
- Deploy propriamente dito é feito pelas plataformas: **Railway** (backend, via `Procfile`/`start.sh`) e **Vercel** (frontend) — o Actions não faz deploy, só valida.
- **Melhoria recomendada**: o CI usa Node 18 mas o projeto fixa Node 22 (`engines`) — alinhar o `node-version` do workflow para 22. Remover os `|| true` de lint/test para que falhas quebrem o PR (hoje passam sempre).

## Boas práticas de PR

- Branches: `feat/…`, `fix/…`, `chore/…`; Conventional Commits.
- PRs pequenos; indicar se toca backend, frontend ou ambos. Checklist:
  - [ ] `npm run lint` e `npm run type-check` (frontend) passam
  - [ ] `npm run build` (frontend) passa
  - [ ] Testes de backend passam (`cd backend && npm test`)
  - [ ] Nenhum segredo/`.env` commitado
  - [ ] Mudança de schema com migration Drizzle e plano de rollback
  - [ ] Screenshots para mudanças de UI
- ≥1 review; squash merge; `main` sempre deployável.

## Testes

- Backend: Jest + Supertest configurados (`npm test`) — cobrir os motores McKee/FEFCO e as rotas de auth/orçamento. Hoje o CI roda com `|| true`; ao adicionar testes reais, tornar o job bloqueante.
- Frontend: sem runner de teste — recomendado Vitest/RTL para componentes críticos (calculadora, formulários com zod) e manter `type-check` no CI.

## Segurança & dados

- Nunca commitar `.env`/segredos; `DATABASE_URL` e `JWT_SECRET` só em Railway/Vercel.
- Multi-tenant: reforçar isolamento por tenant em toda query e checar autorização por papel.
- **LGPD**: cadastro de clientes/usuários guarda dados pessoais — restringir acesso, aproveitar o audit log citado no README, não logar PII.
- `whatsapp-web.js` automatiza WhatsApp — cuidar de credenciais/sessão e conformidade da plataforma; não versionar sessões.
- Revisar dependências (`npm audit`); manter `sharp`/`better`-libs nativas compatíveis com Node 22.

## Gotchas

- **Backend é ESM** (`"type": "module"`): imports de CommonJS precisam de interop; `__dirname`/`require` não existem nativamente.
- **`build:backend` é um no-op** (só `echo`) — não gera artefato; o start roda o fonte direto.
- Descompasso de versão de Node: CI em 18 vs `engines` 22. Rodar local em 22 para evitar surpresas.
- `three`/react-three no frontend são pesados no bundle — usar import dinâmico/`ssr: false` onde couber.
- Deploy dividido: uma mudança de contrato de API exige atualizar **os dois** lados (Railway + Vercel) e o `NEXT_PUBLIC_API_URL`.
- README descreve muitos módulos como visão de produto — confirmar o que já está implementado antes de assumir que uma feature existe.

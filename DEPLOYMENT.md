# 🚀 Guia de Deploy - Sistema Papelão Ondulado Brasil

## 📋 Visão Geral
- **Backend**: Railway (Node.js + Express + Neon Database)
- **Frontend**: Vercel (Next.js 14)
- **Database**: Neon PostgreSQL
- **File Storage**: Google Cloud Storage
- **Monitoramento**: Railway + Vercel Analytics

## 🔧 Configuração do Backend (Railway)

### 1. Preparar o Projeto
```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente no Railway
Acesse o painel do Railway e configure:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=super-secret-jwt-key-here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
WHATSAPP_API_TOKEN=your-whatsapp-token
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Deploy no Railway
1. Conecte seu repositório GitHub ao Railway
2. Selecione a pasta `backend` como root
3. Railway detectará automaticamente o `nixpacks.toml`
4. O deploy será automático a cada push

### 4. Configurar Neon Database
1. Crie uma database no Neon
2. Copie a connection string
3. Configure a variável `DATABASE_URL` no Railway
4. Execute as migrations (automático no primeiro deploy)

## 🌐 Configuração do Frontend (Vercel)

### 1. Preparar o Projeto
```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente no Vercel
No painel da Vercel, configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_APP_ENV=production
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_ENABLE_3D_PREVIEW=true
NEXT_PUBLIC_ENABLE_WHATSAPP=true
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 3. Deploy na Vercel
1. Conecte seu repositório GitHub à Vercel
2. Selecione a pasta `frontend` como root
3. Vercel detectará automaticamente o `next.config.js`
4. Configure as variáveis de ambiente
5. Deploy automático a cada push na branch main

## 🗄️ Configuração do Banco de Dados

### Schema Principal
O sistema usa PostgreSQL com as seguintes tabelas principais:
- `companies` - Multi-tenant
- `users` - Usuários com roles
- `fefco_codes` - Catálogo FEFCO
- `materials` - Materiais corrugados
- `machines` - Máquinas de produção
- `clients` - Clientes
- `quotes` - Cotações
- `production_orders` - Ordens de produção
- `audit_log` - Log de auditoria

### Migrations
```bash
# Executar migrations (automático no Railway)
npm run db:migrate

# Popular dados iniciais
npm run db:seed
```

## ☁️ Configuração do Google Cloud Storage

### 1. Criar Service Account
```bash
# No Google Cloud Console
1. Criar projeto
2. Ativar Cloud Storage API
3. Criar Service Account
4. Baixar JSON key
5. Criar bucket
```

### 2. Configurar Permissões
```json
{
  "bindings": [
    {
      "role": "roles/storage.objectAdmin",
      "members": ["serviceAccount:your-service-account@project.iam.gserviceaccount.com"]
    }
  ]
}
```

## 📱 Configuração do WhatsApp Business API

### 1. Meta Business Account
1. Criar Meta Business Account
2. Configurar WhatsApp Business API
3. Obter Phone Number ID
4. Gerar Access Token

### 2. Webhook Configuration
```env
WHATSAPP_WEBHOOK_URL=https://your-backend.railway.app/api/webhooks/whatsapp
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

## 🔐 Configuração de Segurança

### CORS
```javascript
// Backend configurado para aceitar requests do frontend Vercel
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app' // Preview deployments
  ],
  credentials: true
};
```

### Headers de Segurança
- Helmet.js configurado
- Rate limiting ativo
- JWT authentication
- HTTPS obrigatório em produção

## 📊 Monitoramento

### Railway
- Logs automáticos
- Métricas de performance
- Health checks configurados
- Restart automático em caso de falha

### Vercel
- Analytics integrado
- Web Vitals monitoring
- Error tracking
- Build logs

## 🚀 Processo de Deploy

### Desenvolvimento para Produção
1. **Desenvolver** na branch `develop`
2. **Testar** localmente
3. **Pull Request** para `main`
4. **Code Review** 
5. **Merge** para `main`
6. **Deploy Automático** Railway + Vercel
7. **Verificar** health checks
8. **Monitorar** logs e métricas

### Rollback
```bash
# Railway - usar interface web ou CLI
railway rollback

# Vercel - usar interface web ou CLI
vercel --prod --rollback
```

## 🔧 Troubleshooting

### Problemas Comuns

#### Backend não conecta com database
- Verificar `DATABASE_URL`
- Verificar se Neon database está ativo
- Verificar IP allowlist no Neon

#### Frontend não carrega dados
- Verificar `NEXT_PUBLIC_API_URL`
- Verificar CORS no backend
- Verificar health check: `/health`

#### 3D Preview não funciona
- Verificar se Three.js está carregando
- Verificar WebGL support no browser
- Verificar console para erros JavaScript

#### WhatsApp não envia mensagens
- Verificar tokens e configuração
- Verificar webhook URL
- Verificar logs do Railway

### Logs Úteis
```bash
# Railway logs
railway logs

# Vercel logs (via dashboard)
# Função logs disponíveis em tempo real

# Database logs (Neon dashboard)
# Queries e performance monitoring
```

## 📈 Otimizações de Performance

### Backend
- Connection pooling configurado
- Índices de database otimizados
- Cache Redis (Railway addon)
- Compressão gzip ativa

### Frontend
- Image optimization (Next.js)
- Code splitting automático
- Static generation onde possível
- CDN da Vercel

## 🔄 CI/CD Pipeline

### GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: echo "Auto-deploy configured"
      - name: Deploy to Vercel  
        run: echo "Auto-deploy configured"
```

## 📞 Suporte

### Contatos
- **Desenvolvimento**: seu-email@empresa.com
- **DevOps**: devops@empresa.com
- **Suporte**: suporte@empresa.com

### Resources
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
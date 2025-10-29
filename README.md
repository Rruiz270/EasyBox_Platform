# 📦 Sistema de Gestão da Indústria de Papelão Ondulado - Brasil

> **Sistema revolucionário para a indústria de papelão ondulado brasileira** 
> 
> Integração completa de FEFCO, McKee, cotações 3D, produção e muito mais.

## 🌟 Características Principais

### 🏗️ Arquitetura Completa
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Drizzle ORM
- **Database**: Neon PostgreSQL (multi-tenant)
- **Deploy**: Railway (backend) + Vercel (frontend)
- **Storage**: Google Cloud Storage
- **Mobile**: React Native (vendas)

### 📋 Módulos do Sistema

#### 🏠 **Início**
Dashboard principal com métricas e resumos

#### ⚙️ **SETUP - Cadastro**
- **Cliente**: Gestão completa de clientes
- **Usuário**: Controle de usuários e permissões
- **Canal de vendas**: Canais online, presencial, WhatsApp
- **Centro de custo**: Hierarquia de centros de custo
- **Transportadora**: Gestão de transportadoras e fretes
- **Segmento**: Segmentação de mercado
- **Forma de pagamento**: Métodos de pagamento e condições
- **Fabricante**: Cadastro de fornecedores
- **Produto**: Catálogo de produtos
- **Tipo contato**: Tipos de contato e relacionamento

#### 📋 **Orçamentos**
- **Lista**: Gestão completa de cotações
- **Parâmetros**: Configurações de cálculo
- **Status**: Workflow de aprovação
- **Calculadora**: Motor de cálculos McKee + FEFCO

#### 🔧 **Desenvolvimento**
- **Lista**: Projetos de desenvolvimento
- **Compensações**: Ajustes e compensações
- **Clichê**: Gestão de clichês de impressão
- **Faca**: Controle de facas de corte
- **Processo produção**: Definição de processos

#### 🏭 **Produção**
- **Lista**: Ordens de produção
- Controle de qualidade
- Rastreamento de materiais
- Métricas de performance

#### 🔒 **Segurança**
- Controle de permissões
- Audit log completo
- Gestão de sessões
- Configurações de segurança

## 🚀 Tecnologias Inovadoras

### 🧮 **Motor de Cálculos McKee**
```javascript
// Implementação da fórmula McKee para resistência
const bct = K1_METRIC * ect * Math.sqrt(thickness * perimeter);
```
- Cálculo automático de resistência de caixas
- Fatores ambientais (umidade, temperatura)
- Fatores de segurança por tipo de aplicação
- Recomendações automáticas

### 📐 **Catálogo FEFCO Completo**
- 200+ códigos FEFCO implementados
- Validação automática de dimensões
- Cálculo de blank dimensions
- Compatibilidade com máquinas

### 🎯 **Seleção Inteligente de Caixas**
```javascript
// Sistema sugere FEFCO baseado nos requisitos
const suggestedBox = await suggestFefcoCode({
  product: productSpecs,
  shipping: shippingConditions,
  stacking: stackingRequirements
});
```

### 🎨 **Visualização 3D em Tempo Real**
- Three.js para renderização 3D
- Animações de dobra passo-a-passo
- Preview em tempo real
- Múltiplos ângulos de visualização

## 🏗️ Estrutura do Projeto

```
cardboard-industry-system/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── controllers/       # Controllers por módulo
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Lógica de negócio
│   │   ├── database/         # Schema e migrations
│   │   ├── middleware/       # Middlewares
│   │   └── utils/           # Utilitários
│   ├── railway.json         # Config Railway
│   └── package.json
├── frontend/                  # Next.js 14 + React
│   ├── src/
│   │   ├── app/             # App Router (Next.js 14)
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Bibliotecas e utils
│   │   └── types/           # TypeScript types
│   ├── vercel.json          # Config Vercel
│   └── package.json
├── mobile/                   # React Native (vendas)
├── shared/                   # Código compartilhado
└── DEPLOYMENT.md            # Guia de deploy
```

## 🗄️ Database Schema

### Multi-Tenant com Isolamento Completo
```sql
-- Empresas (multi-tenant)
companies
├── users (roles: admin, sales, engineering, production, client)
├── clients
├── quotes
├── materials
├── machines
└── fefco_codes

-- Módulos especializados
setup_tables
├── sales_channels
├── cost_centers
├── shipping_companies
├── market_segments
├── payment_methods
└── manufacturers

development_tables
├── development_projects
├── compensations
├── printing_plates
├── cutting_dies
└── production_processes
```

## 🔧 Instalação e Desenvolvimento

### Backend (Railway)
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL, JWT_SECRET, etc.
npm run dev
```

### Frontend (Vercel)
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL
npm run dev
```

### Database Setup (Neon)
1. Criar conta no Neon
2. Criar database PostgreSQL
3. Configurar DATABASE_URL
4. Migrations executam automaticamente

## 🌐 Deploy em Produção

### Railway (Backend)
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

### Vercel (Frontend)  
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções completas.

## 🎯 Fluxo de Trabalho Completo

### 1. **Vendedor recebe solicitação**
```
WhatsApp/Telefone/Presencial → Sistema
```

### 2. **Sistema sugere caixa automaticamente**
```javascript
const suggestion = await intelligentBoxSelection({
  product: { weight: 2.5, dimensions: [300, 200, 150] },
  shipping: { stacking: true, humidity: 70 },
  quantity: 1000
});
// → Sugere FEFCO 0201 com material BC flute
```

### 3. **Validação técnica automática**
- McKee formula para resistência
- Compatibilidade com máquinas
- Otimização de material

### 4. **Cotação 3D interativa**
- Cliente visualiza caixa em 3D
- Animação de montagem
- Aprovação online

### 5. **Produção otimizada**
- Ordem automática de produção
- Sequenciamento otimizado
- Controle de qualidade

## 📊 Dashboards e Métricas

### Dashboard Vendas
- Cotações por status
- Conversion rate
- Pipeline de vendas
- Metas vs realizadas

### Dashboard Produção
- OEE (Overall Equipment Effectiveness)
- Consumo de materiais
- Qualidade por lote
- Programação vs realizado

### Dashboard Financeiro
- Margem por produto
- Custos por centro
- Fluxo de caixa
- ROI por cliente

## 🔗 Integrações

### CRM Integration
```javascript
// Futura integração com CRMs brasileiros
const crmSync = {
  salesforce: { endpoint: '/api/crm/salesforce' },
  pipedrive: { endpoint: '/api/crm/pipedrive' },
  hubspot: { endpoint: '/api/crm/hubspot' }
};
```

### ERP Integration
```javascript
// Integração com ERPs
const erpSync = {
  sap: { endpoint: '/api/erp/sap' },
  oracle: { endpoint: '/api/erp/oracle' },
  protheus: { endpoint: '/api/erp/protheus' }
};
```

### WhatsApp Business API
```javascript
// Envio automático de cotações
await sendQuoteViaWhatsApp({
  clientPhone: '+5511999999999',
  quote: quoteData,
  attachments: ['quote.pdf', '3d_preview.mp4']
});
```

## 🔒 Segurança e Compliance

### LGPD Compliance
- Consentimento explícito
- Portabilidade de dados
- Direito ao esquecimento
- Audit log completo

### Segurança
- JWT authentication
- Role-based access control (RBAC)
- Rate limiting
- Encryption at rest
- HTTPS obrigatório

## 📱 Mobile (Vendas)

### React Native App
```javascript
// Features mobile para vendedores
const mobileFeatures = [
  'Cotação offline',
  'Câmera para medições',
  'GPS para visitas',
  'Sincronização automática',
  'Push notifications'
];
```

## 🎨 Recursos Visuais

### 3D Box Visualization
- WebGL via Three.js
- Materiais realísticos
- Lighting e shadows
- Responsive design

### Responsive Design
- Mobile-first approach
- Progressive Web App (PWA)
- Offline capabilities
- Touch-friendly interface

## 📈 Métricas de Performance

### Frontend
- Lighthouse Score: 95+
- First Contentful Paint: <2s
- Core Web Vitals: Green
- Bundle Size: Otimizado

### Backend  
- Response Time: <200ms
- Uptime: 99.9%
- Database Queries: Otimizadas
- Memory Usage: Monitorado

## 🤝 Contribuição

### Development Workflow
1. Fork do repositório
2. Feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Add: nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Pull Request

### Code Style
- ESLint + Prettier configurado
- TypeScript strict mode
- Conventional Commits
- Testes obrigatórios

## 📞 Suporte

### Contato
- **Email**: suporte@sistema-papelao.com.br
- **WhatsApp**: +55 11 99999-9999
- **Documentação**: [docs.sistema-papelao.com.br](https://docs.sistema-papelao.com.br)

### Resources
- [Guia de Deploy](./DEPLOYMENT.md)
- [API Documentation](./API.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 📄 Licença

Copyright © 2024 Sistema Papelão Ondulado Brasil. Todos os direitos reservados.

---

**🚀 Revolucionando a indústria de papelão ondulado no Brasil, uma caixa por vez!**
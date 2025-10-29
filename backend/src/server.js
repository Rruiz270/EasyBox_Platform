import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import winston from 'winston';

// Import routes
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import fefcoRoutes from './routes/fefco.js';
import materialRoutes from './routes/materials.js';
import machineRoutes from './routes/machines.js';
import quoteRoutes from './routes/quotes.js';
import clientRoutes from './routes/clients.js';
import calculationRoutes from './routes/calculations.js';
import fileRoutes from './routes/files.js';
import setupRoutes from './routes/setup.js';
import orcamentosRoutes from './routes/orcamentos.js';
import desenvolvimentoRoutes from './routes/desenvolvimento.js';
import producaoRoutes from './routes/producao.js';
import segurancaRoutes from './routes/seguranca.js';
import testRoutes from './routes/test.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { tenantMiddleware } from './middleware/tenant.js';

dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multi-tenant middleware
app.use(tenantMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fefco', fefcoRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/files', fileRoutes);

// Test routes (for deployment verification)
app.use('/api/test', testRoutes);

// Main application modules
app.use('/api/setup', setupRoutes);
app.use('/api/orcamentos', orcamentosRoutes);
app.use('/api/desenvolvimento', desenvolvimentoRoutes);
app.use('/api/producao', producaoRoutes);
app.use('/api/seguranca', segurancaRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    message: `${req.method} ${req.originalUrl} não existe`
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📦 Sistema de Gestão da Indústria de Papelão Ondulado - Brasil`);
  logger.info(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection.js';
import { users, companies, auditLog } from '../database/schema.js';
import { eq, and } from 'drizzle-orm';
import { validateRequest } from '../middleware/validation.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new company and admin user
router.post('/register', authRateLimiter, validateRequest('register'), async (req, res) => {
  try {
    const { email, password, name, companyName, document } = req.validatedData;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return res.status(409).json({
        error: 'Usuário já existe',
        code: 'USER_EXISTS'
      });
    }

    // Check if company document already exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.document, document));

    if (existingCompany) {
      return res.status(409).json({
        error: 'Empresa já cadastrada',
        code: 'COMPANY_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company first
    const [newCompany] = await db
      .insert(companies)
      .values({
        name: companyName,
        document,
        email,
        subscription: 'trial',
        subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        settings: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          currency: 'BRL'
        }
      })
      .returning();

    // Create admin user
    const [newUser] = await db
      .insert(users)
      .values({
        companyId: newCompany.id,
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        permissions: []
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        companyId: users.companyId
      });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id,
        companyId: newCompany.id,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log registration
    await db.insert(auditLog).values({
      companyId: newCompany.id,
      userId: newUser.id,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: newUser.id,
      newData: { email, name, role: 'admin' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      message: 'Conta criada com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        company: {
          id: newCompany.id,
          name: newCompany.name,
          subscription: newCompany.subscription
        }
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login
router.post('/login', authRateLimiter, validateRequest('login'), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Get user with company information
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        name: users.name,
        role: users.role,
        permissions: users.permissions,
        isActive: users.isActive,
        companyId: users.companyId,
        companyName: companies.name,
        companyDocument: companies.document,
        companySubscription: companies.subscription,
        companyIsActive: companies.isActive
      })
      .from(users)
      .innerJoin(companies, eq(users.companyId, companies.id))
      .where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Usuário inativo',
        code: 'USER_INACTIVE'
      });
    }

    if (!user.companyIsActive) {
      return res.status(401).json({
        error: 'Empresa inativa',
        code: 'COMPANY_INACTIVE'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log login
    await db.insert(auditLog).values({
      companyId: user.companyId,
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        company: {
          id: user.companyId,
          name: user.companyName,
          document: user.companyDocument,
          subscription: user.companySubscription
        }
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'LOGIN_ERROR'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        permissions: req.user.permissions,
        company: {
          id: req.user.companyId,
          name: req.user.companyName,
          settings: req.user.companySettings
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'PROFILE_ERROR'
    });
  }
});

// Logout (invalidate token - in a real app you'd maintain a blacklist)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log logout
    await db.insert(auditLog).values({
      companyId: req.user.companyId,
      userId: req.user.id,
      action: 'USER_LOGOUT',
      entityType: 'user',
      entityId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate new token
    const token = jwt.sign(
      { 
        userId: req.user.id,
        companyId: req.user.companyId,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'TOKEN_REFRESH_ERROR'
    });
  }
});

export default router;
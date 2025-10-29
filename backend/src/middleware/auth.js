import jwt from 'jsonwebtoken';
import { db } from '../database/connection.js';
import { users, companies } from '../database/schema.js';
import { eq, and } from 'drizzle-orm';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with company information
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        permissions: users.permissions,
        companyId: users.companyId,
        companyName: companies.name,
        companySettings: companies.settings,
        isActive: users.isActive
      })
      .from(users)
      .innerJoin(companies, eq(users.companyId, companies.id))
      .where(and(
        eq(users.id, decoded.userId),
        eq(users.isActive, true),
        eq(companies.isActive, true)
      ));

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado ou inativo',
        code: 'USER_NOT_FOUND'
      });
    }

    // Add user and tenant info to request
    req.user = user;
    req.tenantId = user.companyId;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Permissão insuficiente',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

export const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = userPermissions.some(permission => 
      permission.resource === resource && permission.action === action
    );

    // Admin role has all permissions
    if (req.user.role === 'admin' || hasPermission) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Permissão específica requerida',
      code: 'PERMISSION_DENIED',
      required: { resource, action }
    });
  };
};
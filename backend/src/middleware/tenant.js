import { db } from '../database/connection.js';
import { companies } from '../database/schema.js';
import { eq } from 'drizzle-orm';

export const tenantMiddleware = async (req, res, next) => {
  try {
    // Skip tenant check for auth endpoints and health check
    const skipTenantPaths = ['/api/auth', '/health'];
    if (skipTenantPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // For authenticated requests, tenant is set by auth middleware
    if (req.user && req.tenantId) {
      // Verify tenant is still active
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, req.tenantId));

      if (!company || !company.isActive) {
        return res.status(403).json({
          error: 'Empresa inativa ou não encontrada',
          code: 'TENANT_INACTIVE'
        });
      }

      // Add tenant context to request
      req.tenant = company;
      return next();
    }

    // For non-authenticated requests, we might need tenant info from headers
    const tenantId = req.headers['x-tenant-id'];
    if (tenantId) {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, tenantId));

      if (company && company.isActive) {
        req.tenant = company;
        req.tenantId = company.id;
      }
    }

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'TENANT_ERROR'
    });
  }
};
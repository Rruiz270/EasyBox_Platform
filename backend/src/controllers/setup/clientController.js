import { getDatabase } from '../../database/connection.js';
import { clients, auditLog } from '../../database/schema.js';
import { eq, and, desc, ilike, or } from 'drizzle-orm';

const db = getDatabase;

export const createClient = async (req, res) => {
  try {
    const clientData = {
      ...req.validatedData,
      companyId: req.tenantId
    };

    const [newClient] = await db
      .insert(clients)
      .values(clientData)
      .returning();

    // Log creation
    await db.insert(auditLog).values({
      companyId: req.tenantId,
      userId: req.user.id,
      action: 'CLIENT_CREATED',
      entityType: 'client',
      entityId: newClient.id,
      newData: clientData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      client: newClient
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      error: 'Erro ao criar cliente',
      code: 'CREATE_CLIENT_ERROR'
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      industry,
      isActive,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const offset = (page - 1) * limit;
    
    let query = db
      .select()
      .from(clients)
      .where(eq(clients.companyId, req.tenantId));

    // Apply filters
    if (search) {
      query = query.where(
        or(
          ilike(clients.name, `%${search}%`),
          ilike(clients.email, `%${search}%`),
          ilike(clients.contactPerson, `%${search}%`)
        )
      );
    }

    if (industry) {
      query = query.where(eq(clients.industry, industry));
    }

    if (isActive !== undefined) {
      query = query.where(eq(clients.isActive, isActive === 'true'));
    }

    // Apply sorting
    const sortColumn = clients[sortBy] || clients.name;
    query = sortOrder === 'desc' 
      ? query.orderBy(desc(sortColumn))
      : query.orderBy(sortColumn);

    // Apply pagination
    const clientList = await query.limit(parseInt(limit)).offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: db.count() })
      .from(clients)
      .where(eq(clients.companyId, req.tenantId));

    res.json({
      clients: clientList,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      error: 'Erro ao buscar clientes',
      code: 'GET_CLIENTS_ERROR'
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const [client] = await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.id, id),
        eq(clients.companyId, req.tenantId)
      ));

    if (!client) {
      return res.status(404).json({
        error: 'Cliente não encontrado',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client by ID error:', error);
    res.status(500).json({
      error: 'Erro ao buscar cliente',
      code: 'GET_CLIENT_ERROR'
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.validatedData,
      updatedAt: new Date()
    };

    // Get current client data for audit
    const [currentClient] = await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.id, id),
        eq(clients.companyId, req.tenantId)
      ));

    if (!currentClient) {
      return res.status(404).json({
        error: 'Cliente não encontrado',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    const [updatedClient] = await db
      .update(clients)
      .set(updateData)
      .where(and(
        eq(clients.id, id),
        eq(clients.companyId, req.tenantId)
      ))
      .returning();

    // Log update
    await db.insert(auditLog).values({
      companyId: req.tenantId,
      userId: req.user.id,
      action: 'CLIENT_UPDATED',
      entityType: 'client',
      entityId: id,
      oldData: currentClient,
      newData: updateData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Cliente atualizado com sucesso',
      client: updatedClient
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      error: 'Erro ao atualizar cliente',
      code: 'UPDATE_CLIENT_ERROR'
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current client data for audit
    const [currentClient] = await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.id, id),
        eq(clients.companyId, req.tenantId)
      ));

    if (!currentClient) {
      return res.status(404).json({
        error: 'Cliente não encontrado',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Soft delete (set isActive to false)
    await db
      .update(clients)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(and(
        eq(clients.id, id),
        eq(clients.companyId, req.tenantId)
      ));

    // Log deletion
    await db.insert(auditLog).values({
      companyId: req.tenantId,
      userId: req.user.id,
      action: 'CLIENT_DELETED',
      entityType: 'client',
      entityId: id,
      oldData: currentClient,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Cliente removido com sucesso'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      error: 'Erro ao remover cliente',
      code: 'DELETE_CLIENT_ERROR'
    });
  }
};
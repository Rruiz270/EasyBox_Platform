import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
} from '../controllers/seguranca/permissionController.js';
import {
  getRolePermissions,
  assignRolePermissions,
  removeRolePermissions,
  getAvailableRoles
} from '../controllers/seguranca/roleController.js';
import {
  getUserSessions,
  terminateUserSession,
  terminateAllUserSessions,
  getActiveUsers
} from '../controllers/seguranca/sessionController.js';
import {
  getAuditLogs,
  getAuditLogById,
  exportAuditLogs,
  getAuditMetrics
} from '../controllers/seguranca/auditController.js';
import {
  getSecuritySettings,
  updateSecuritySettings,
  testSecurityConfiguration,
  resetSecuritySettings
} from '../controllers/seguranca/settingsController.js';
import {
  getLoginAttempts,
  getFailedLogins,
  blockUser,
  unblockUser,
  getBlockedUsers
} from '../controllers/seguranca/accessController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Only admin users can access security features
router.use(requireRole(['admin']));

// ===============================
// PERMISSIONS MANAGEMENT
// ===============================
router.get('/permissions', getPermissions);
router.post('/permissions', validateRequest('createPermission'), createPermission);
router.put('/permissions/:id', validateRequest('updatePermission'), updatePermission);
router.delete('/permissions/:id', deletePermission);

// ===============================
// ROLE MANAGEMENT
// ===============================
router.get('/roles', getAvailableRoles);
router.get('/roles/:role/permissions', getRolePermissions);
router.post('/roles/:role/permissions', validateRequest('assignRolePermissions'), assignRolePermissions);
router.delete('/roles/:role/permissions', validateRequest('removeRolePermissions'), removeRolePermissions);

// ===============================
// SESSION MANAGEMENT
// ===============================
router.get('/sessions', getUserSessions);
router.get('/sessions/active-users', getActiveUsers);
router.delete('/sessions/:sessionId', terminateUserSession);
router.delete('/users/:userId/sessions', terminateAllUserSessions);

// ===============================
// AUDIT LOG
// ===============================
router.get('/audit-logs', getAuditLogs);
router.get('/audit-logs/:id', getAuditLogById);
router.get('/audit-logs/export', exportAuditLogs);
router.get('/audit-metrics', getAuditMetrics);

// ===============================
// SECURITY SETTINGS
// ===============================
router.get('/settings', getSecuritySettings);
router.put('/settings', validateRequest('updateSecuritySettings'), updateSecuritySettings);
router.post('/settings/test', testSecurityConfiguration);
router.post('/settings/reset', resetSecuritySettings);

// ===============================
// ACCESS CONTROL
// ===============================
router.get('/login-attempts', getLoginAttempts);
router.get('/failed-logins', getFailedLogins);
router.get('/blocked-users', getBlockedUsers);
router.post('/users/:userId/block', validateRequest('blockUser'), blockUser);
router.post('/users/:userId/unblock', unblockUser);

export default router;
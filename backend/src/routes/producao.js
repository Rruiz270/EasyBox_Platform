import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  createProductionOrder,
  getProductionOrders,
  getProductionOrderById,
  updateProductionOrder,
  deleteProductionOrder,
  startProduction,
  pauseProduction,
  completeProduction,
  cancelProduction,
  getProductionSchedule,
  optimizeSchedule,
  getProductionMetrics,
  getProductionReport
} from '../controllers/producao/productionOrderController.js';
import {
  recordMaterialConsumption,
  getMaterialConsumption,
  updateMaterialConsumption,
  validateMaterialAvailability
} from '../controllers/producao/materialConsumptionController.js';
import {
  recordQualityCheck,
  getQualityChecks,
  updateQualityCheck,
  getQualityMetrics,
  createQualityAlert
} from '../controllers/producao/qualityController.js';
import {
  recordDowntime,
  getDowntimeReports,
  updateDowntime,
  getMaintenanceSchedule,
  scheduleMaintenanceFromDowntime
} from '../controllers/producao/downtimeController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// ===============================
// LISTA DE PRODUÇÃO (Production Orders List)
// ===============================
router.get('/lista', getProductionOrders);
router.get('/lista/:id', getProductionOrderById);
router.post('/lista', requireRole(['admin', 'production', 'engineering']), validateRequest('createProductionOrder'), createProductionOrder);
router.put('/lista/:id', requireRole(['admin', 'production', 'engineering']), validateRequest('updateProductionOrder'), updateProductionOrder);
router.delete('/lista/:id', requireRole(['admin']), deleteProductionOrder);

// Production control actions
router.post('/lista/:id/start', requireRole(['admin', 'production']), validateRequest('startProduction'), startProduction);
router.post('/lista/:id/pause', requireRole(['admin', 'production']), pauseProduction);
router.post('/lista/:id/complete', requireRole(['admin', 'production']), validateRequest('completeProduction'), completeProduction);
router.post('/lista/:id/cancel', requireRole(['admin', 'production']), validateRequest('cancelProduction'), cancelProduction);

// ===============================
// SCHEDULING & PLANNING
// ===============================
router.get('/schedule', requireRole(['admin', 'production', 'engineering']), getProductionSchedule);
router.post('/schedule/optimize', requireRole(['admin', 'production']), optimizeSchedule);

// ===============================
// MATERIAL CONSUMPTION
// ===============================
router.get('/lista/:id/material-consumption', requireRole(['admin', 'production']), getMaterialConsumption);
router.post('/lista/:id/material-consumption', requireRole(['admin', 'production']), validateRequest('recordMaterialConsumption'), recordMaterialConsumption);
router.put('/lista/:id/material-consumption/:consumptionId', requireRole(['admin', 'production']), validateRequest('updateMaterialConsumption'), updateMaterialConsumption);
router.post('/material-availability', requireRole(['admin', 'production']), validateRequest('validateMaterialAvailability'), validateMaterialAvailability);

// ===============================
// QUALITY CONTROL
// ===============================
router.get('/lista/:id/quality-checks', requireRole(['admin', 'production', 'engineering']), getQualityChecks);
router.post('/lista/:id/quality-checks', requireRole(['admin', 'production']), validateRequest('recordQualityCheck'), recordQualityCheck);
router.put('/quality-checks/:checkId', requireRole(['admin', 'production']), validateRequest('updateQualityCheck'), updateQualityCheck);
router.get('/quality-metrics', requireRole(['admin', 'production', 'engineering']), getQualityMetrics);
router.post('/quality-alerts', requireRole(['admin', 'production']), validateRequest('createQualityAlert'), createQualityAlert);

// ===============================
// DOWNTIME & MAINTENANCE
// ===============================
router.get('/downtime', requireRole(['admin', 'production', 'engineering']), getDowntimeReports);
router.post('/downtime', requireRole(['admin', 'production']), validateRequest('recordDowntime'), recordDowntime);
router.put('/downtime/:downtimeId', requireRole(['admin', 'production']), validateRequest('updateDowntime'), updateDowntime);
router.get('/maintenance-schedule', requireRole(['admin', 'production', 'engineering']), getMaintenanceSchedule);
router.post('/downtime/:downtimeId/schedule-maintenance', requireRole(['admin', 'production']), scheduleMaintenanceFromDowntime);

// ===============================
// REPORTS & METRICS
// ===============================
router.get('/metrics', requireRole(['admin', 'production', 'engineering']), getProductionMetrics);
router.get('/reports', requireRole(['admin', 'production', 'engineering']), getProductionReport);

export default router;
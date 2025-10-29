import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  createDevelopmentProject,
  getDevelopmentProjects,
  getDevelopmentProjectById,
  updateDevelopmentProject,
  deleteDevelopmentProject,
  assignProject,
  changeProjectStatus,
  getProjectTimeTracking
} from '../controllers/desenvolvimento/projectController.js';
import {
  createCompensation,
  getCompensations,
  updateCompensation,
  deleteCompensation,
  applyCompensation
} from '../controllers/desenvolvimento/compensationController.js';
import {
  createPrintingPlate,
  getPrintingPlates,
  updatePrintingPlate,
  deletePrintingPlate,
  getPrintingPlateById,
  uploadPlateFiles
} from '../controllers/desenvolvimento/printingPlateController.js';
import {
  createCuttingDie,
  getCuttingDies,
  updateCuttingDie,
  deleteCuttingDie,
  getCuttingDieById,
  uploadDieFiles,
  scheduleMaintenance
} from '../controllers/desenvolvimento/cuttingDieController.js';
import {
  createProductionProcess,
  getProductionProcesses,
  updateProductionProcess,
  deleteProductionProcess,
  getProductionProcessById,
  validateProcess,
  optimizeProcess
} from '../controllers/desenvolvimento/productionProcessController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// ===============================
// LISTA DE PROJETOS (Project List)
// ===============================
router.get('/lista', getDevelopmentProjects);
router.get('/lista/:id', getDevelopmentProjectById);
router.post('/lista', requireRole(['admin', 'engineering']), validateRequest('createDevelopmentProject'), createDevelopmentProject);
router.put('/lista/:id', requireRole(['admin', 'engineering']), validateRequest('updateDevelopmentProject'), updateDevelopmentProject);
router.delete('/lista/:id', requireRole(['admin']), deleteDevelopmentProject);

// Project management actions
router.post('/lista/:id/assign', requireRole(['admin', 'engineering']), validateRequest('assignProject'), assignProject);
router.put('/lista/:id/status', requireRole(['admin', 'engineering']), validateRequest('changeProjectStatus'), changeProjectStatus);
router.get('/lista/:id/time-tracking', requireRole(['admin', 'engineering']), getProjectTimeTracking);

// ===============================
// COMPENSAÇÕES (Compensations)
// ===============================
router.get('/compensacoes', getCompensations);
router.post('/compensacoes', requireRole(['admin', 'engineering']), validateRequest('createCompensation'), createCompensation);
router.put('/compensacoes/:id', requireRole(['admin', 'engineering']), validateRequest('updateCompensation'), updateCompensation);
router.delete('/compensacoes/:id', requireRole(['admin']), deleteCompensation);
router.post('/compensacoes/:id/apply', requireRole(['admin', 'engineering']), applyCompensation);

// ===============================
// CLICHÊ (Printing Plates)
// ===============================
router.get('/cliche', getPrintingPlates);
router.get('/cliche/:id', getPrintingPlateById);
router.post('/cliche', requireRole(['admin', 'engineering']), validateRequest('createPrintingPlate'), createPrintingPlate);
router.put('/cliche/:id', requireRole(['admin', 'engineering']), validateRequest('updatePrintingPlate'), updatePrintingPlate);
router.delete('/cliche/:id', requireRole(['admin']), deletePrintingPlate);
router.post('/cliche/:id/upload', requireRole(['admin', 'engineering']), uploadPlateFiles);

// ===============================
// FACA (Cutting Dies)
// ===============================
router.get('/faca', getCuttingDies);
router.get('/faca/:id', getCuttingDieById);
router.post('/faca', requireRole(['admin', 'engineering']), validateRequest('createCuttingDie'), createCuttingDie);
router.put('/faca/:id', requireRole(['admin', 'engineering']), validateRequest('updateCuttingDie'), updateCuttingDie);
router.delete('/faca/:id', requireRole(['admin']), deleteCuttingDie);
router.post('/faca/:id/upload', requireRole(['admin', 'engineering']), uploadDieFiles);
router.post('/faca/:id/maintenance', requireRole(['admin', 'engineering', 'production']), validateRequest('scheduleMaintenance'), scheduleMaintenance);

// ===============================
// PROCESSO PRODUÇÃO (Production Processes)
// ===============================
router.get('/processo-producao', getProductionProcesses);
router.get('/processo-producao/:id', getProductionProcessById);
router.post('/processo-producao', requireRole(['admin', 'engineering']), validateRequest('createProductionProcess'), createProductionProcess);
router.put('/processo-producao/:id', requireRole(['admin', 'engineering']), validateRequest('updateProductionProcess'), updateProductionProcess);
router.delete('/processo-producao/:id', requireRole(['admin']), deleteProductionProcess);
router.post('/processo-producao/:id/validate', requireRole(['admin', 'engineering']), validateProcess);
router.post('/processo-producao/:id/optimize', requireRole(['admin', 'engineering']), optimizeProcess);

export default router;
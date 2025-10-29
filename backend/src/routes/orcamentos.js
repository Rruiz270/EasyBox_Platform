import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  duplicateQuote,
  sendQuoteToClient,
  approveQuote,
  rejectQuote,
  getQuoteHistory
} from '../controllers/orcamentos/quoteController.js';
import {
  getQuoteParameters,
  createQuoteParameter,
  updateQuoteParameter,
  deleteQuoteParameter
} from '../controllers/orcamentos/parametersController.js';
import {
  getQuoteStatuses,
  createQuoteStatus,
  updateQuoteStatus,
  deleteQuoteStatus,
  reorderQuoteStatuses
} from '../controllers/orcamentos/statusController.js';
import {
  calculateQuote,
  calculateMcKeeStrength,
  calculateBlankDimensions,
  calculateMaterialCosts,
  calculateProductionCosts,
  validateBoxDimensions
} from '../controllers/orcamentos/calculatorController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// ===============================
// LISTA DE ORÇAMENTOS (Quote List)
// ===============================
router.get('/lista', getQuotes);
router.get('/lista/:id', getQuoteById);
router.post('/lista', requireRole(['admin', 'sales']), validateRequest('createQuote'), createQuote);
router.put('/lista/:id', requireRole(['admin', 'sales', 'engineering']), validateRequest('updateQuote'), updateQuote);
router.delete('/lista/:id', requireRole(['admin']), deleteQuote);

// Quote actions
router.post('/lista/:id/duplicate', requireRole(['admin', 'sales']), duplicateQuote);
router.post('/lista/:id/send', requireRole(['admin', 'sales']), sendQuoteToClient);
router.post('/lista/:id/approve', requireRole(['admin', 'sales', 'engineering']), approveQuote);
router.post('/lista/:id/reject', requireRole(['admin', 'sales', 'engineering']), rejectQuote);
router.get('/lista/:id/history', getQuoteHistory);

// ===============================
// PARÂMETROS (Parameters)
// ===============================
router.get('/parametros', getQuoteParameters);
router.post('/parametros', requireRole(['admin', 'engineering']), validateRequest('createQuoteParameter'), createQuoteParameter);
router.put('/parametros/:id', requireRole(['admin', 'engineering']), validateRequest('updateQuoteParameter'), updateQuoteParameter);
router.delete('/parametros/:id', requireRole(['admin']), deleteQuoteParameter);

// ===============================
// STATUS
// ===============================
router.get('/status', getQuoteStatuses);
router.post('/status', requireRole(['admin']), validateRequest('createQuoteStatus'), createQuoteStatus);
router.put('/status/:id', requireRole(['admin']), validateRequest('updateQuoteStatus'), updateQuoteStatus);
router.delete('/status/:id', requireRole(['admin']), deleteQuoteStatus);
router.put('/status/reorder', requireRole(['admin']), reorderQuoteStatuses);

// ===============================
// CALCULADORA (Calculator)
// ===============================
router.post('/calculadora/quote', requireRole(['admin', 'sales', 'engineering']), validateRequest('calculateQuote'), calculateQuote);
router.post('/calculadora/mckee', requireRole(['admin', 'sales', 'engineering']), validateRequest('calculateMcKee'), calculateMcKeeStrength);
router.post('/calculadora/blank-dimensions', requireRole(['admin', 'sales', 'engineering']), validateRequest('calculateBlank'), calculateBlankDimensions);
router.post('/calculadora/material-costs', requireRole(['admin', 'sales', 'engineering']), validateRequest('calculateMaterialCosts'), calculateMaterialCosts);
router.post('/calculadora/production-costs', requireRole(['admin', 'sales', 'engineering']), validateRequest('calculateProductionCosts'), calculateProductionCosts);
router.post('/calculadora/validate-dimensions', requireRole(['admin', 'sales', 'engineering']), validateRequest('validateDimensions'), validateBoxDimensions);

export default router;
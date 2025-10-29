import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { 
  createClient, 
  getClients, 
  updateClient, 
  deleteClient,
  getClientById 
} from '../controllers/setup/clientController.js';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/setup/userController.js';
import {
  createSalesChannel,
  getSalesChannels,
  updateSalesChannel,
  deleteSalesChannel
} from '../controllers/setup/salesChannelController.js';
import {
  createCostCenter,
  getCostCenters,
  updateCostCenter,
  deleteCostCenter
} from '../controllers/setup/costCenterController.js';
import {
  createShippingCompany,
  getShippingCompanies,
  updateShippingCompany,
  deleteShippingCompany
} from '../controllers/setup/shippingCompanyController.js';
import {
  createMarketSegment,
  getMarketSegments,
  updateMarketSegment,
  deleteMarketSegment
} from '../controllers/setup/marketSegmentController.js';
import {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod
} from '../controllers/setup/paymentMethodController.js';
import {
  createManufacturer,
  getManufacturers,
  updateManufacturer,
  deleteManufacturer
} from '../controllers/setup/manufacturerController.js';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from '../controllers/setup/productController.js';
import {
  createContactType,
  getContactTypes,
  updateContactType,
  deleteContactType
} from '../controllers/setup/contactTypeController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// ===============================
// CLIENTES (Clients)
// ===============================
router.get('/clientes', getClients);
router.get('/clientes/:id', getClientById);
router.post('/clientes', requireRole(['admin', 'sales']), validateRequest('createClient'), createClient);
router.put('/clientes/:id', requireRole(['admin', 'sales']), validateRequest('updateClient'), updateClient);
router.delete('/clientes/:id', requireRole(['admin']), deleteClient);

// ===============================
// USUÁRIOS (Users)
// ===============================
router.get('/usuarios', requireRole(['admin']), getUsers);
router.get('/usuarios/:id', requireRole(['admin']), getUserById);
router.post('/usuarios', requireRole(['admin']), validateRequest('createUser'), createUser);
router.put('/usuarios/:id', requireRole(['admin']), validateRequest('updateUser'), updateUser);
router.delete('/usuarios/:id', requireRole(['admin']), deleteUser);

// ===============================
// CANAL DE VENDAS (Sales Channels)
// ===============================
router.get('/canais-vendas', getSalesChannels);
router.post('/canais-vendas', requireRole(['admin']), validateRequest('createSalesChannel'), createSalesChannel);
router.put('/canais-vendas/:id', requireRole(['admin']), validateRequest('updateSalesChannel'), updateSalesChannel);
router.delete('/canais-vendas/:id', requireRole(['admin']), deleteSalesChannel);

// ===============================
// CENTRO DE CUSTO (Cost Centers)
// ===============================
router.get('/centros-custo', getCostCenters);
router.post('/centros-custo', requireRole(['admin']), validateRequest('createCostCenter'), createCostCenter);
router.put('/centros-custo/:id', requireRole(['admin']), validateRequest('updateCostCenter'), updateCostCenter);
router.delete('/centros-custo/:id', requireRole(['admin']), deleteCostCenter);

// ===============================
// TRANSPORTADORA (Shipping Companies)
// ===============================
router.get('/transportadoras', getShippingCompanies);
router.post('/transportadoras', requireRole(['admin']), validateRequest('createShippingCompany'), createShippingCompany);
router.put('/transportadoras/:id', requireRole(['admin']), validateRequest('updateShippingCompany'), updateShippingCompany);
router.delete('/transportadoras/:id', requireRole(['admin']), deleteShippingCompany);

// ===============================
// SEGMENTO (Market Segments)
// ===============================
router.get('/segmentos', getMarketSegments);
router.post('/segmentos', requireRole(['admin']), validateRequest('createMarketSegment'), createMarketSegment);
router.put('/segmentos/:id', requireRole(['admin']), validateRequest('updateMarketSegment'), updateMarketSegment);
router.delete('/segmentos/:id', requireRole(['admin']), deleteMarketSegment);

// ===============================
// FORMA DE PAGAMENTO (Payment Methods)
// ===============================
router.get('/formas-pagamento', getPaymentMethods);
router.post('/formas-pagamento', requireRole(['admin']), validateRequest('createPaymentMethod'), createPaymentMethod);
router.put('/formas-pagamento/:id', requireRole(['admin']), validateRequest('updatePaymentMethod'), updatePaymentMethod);
router.delete('/formas-pagamento/:id', requireRole(['admin']), deletePaymentMethod);

// ===============================
// FABRICANTE (Manufacturers)
// ===============================
router.get('/fabricantes', getManufacturers);
router.post('/fabricantes', requireRole(['admin']), validateRequest('createManufacturer'), createManufacturer);
router.put('/fabricantes/:id', requireRole(['admin']), validateRequest('updateManufacturer'), updateManufacturer);
router.delete('/fabricantes/:id', requireRole(['admin']), deleteManufacturer);

// ===============================
// PRODUTO (Products)
// ===============================
router.get('/produtos', getProducts);
router.post('/produtos', requireRole(['admin']), validateRequest('createProduct'), createProduct);
router.put('/produtos/:id', requireRole(['admin']), validateRequest('updateProduct'), updateProduct);
router.delete('/produtos/:id', requireRole(['admin']), deleteProduct);

// ===============================
// TIPO CONTATO (Contact Types)
// ===============================
router.get('/tipos-contato', getContactTypes);
router.post('/tipos-contato', requireRole(['admin']), validateRequest('createContactType'), createContactType);
router.put('/tipos-contato/:id', requireRole(['admin']), validateRequest('updateContactType'), updateContactType);
router.delete('/tipos-contato/:id', requireRole(['admin']), deleteContactType);

export default router;
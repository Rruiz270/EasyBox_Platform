import { pgTable, text, uuid, timestamp, decimal, integer, boolean, jsonb, varchar, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Multi-tenant companies table
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }).unique(), // CNPJ
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }),
  address: jsonb('address'), // Complete address object
  subscription: varchar('subscription', { length: 50 }).default('trial'), // trial, basic, premium, enterprise
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  settings: jsonb('settings').default({}), // Company-specific settings
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Users table with role-based access
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // sales, engineering, production, admin, client
  permissions: jsonb('permissions').default([]), // Granular permissions
  avatar: text('avatar'),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// FEFCO box codes catalog
export const fefcoCodes = pgTable('fefco_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 10 }).unique().notNull(), // e.g., "0201"
  series: varchar('series', { length: 10 }).notNull(), // e.g., "02"
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(), // Slotted, Telescope, etc.
  dieline: jsonb('dieline'), // SVG/vector data for the box dieline
  foldingSequence: jsonb('folding_sequence'), // Steps for 3D folding animation
  constraints: jsonb('constraints'), // Min/max dimensions, ratios, etc.
  machineCompatibility: jsonb('machine_compatibility'), // Which machines can produce this
  isStandard: boolean('is_standard').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Corrugated materials catalog
export const materials = pgTable('materials', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // single_face, single_wall, double_wall, triple_wall
  flute: varchar('flute', { length: 10 }).notNull(), // A, B, C, E, F, BC, EB, etc.
  ect: decimal('ect', { precision: 5, scale: 2 }).notNull(), // Edge Crush Test (kN/m)
  bct: decimal('bct', { precision: 5, scale: 2 }), // Box Compression Test (kN)
  thickness: decimal('thickness', { precision: 4, scale: 2 }).notNull(), // mm
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(), // g/m²
  costPerM2: decimal('cost_per_m2', { precision: 8, scale: 4 }).notNull(), // R$/m²
  supplier: varchar('supplier', { length: 255 }),
  specifications: jsonb('specifications'), // Detailed specs
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Manufacturing machines catalog
export const machines = pgTable('machines', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // flexo_folder_gluer, printer_slotter, rotary_die_cutter, etc.
  manufacturer: varchar('manufacturer', { length: 255 }),
  model: varchar('model', { length: 255 }),
  maxSheetWidth: integer('max_sheet_width').notNull(), // mm
  maxSheetHeight: integer('max_sheet_height').notNull(), // mm
  minSheetWidth: integer('min_sheet_width').notNull(), // mm
  minSheetHeight: integer('min_sheet_height').notNull(), // mm
  maxSpeed: integer('max_speed'), // sheets/hour
  setupTime: integer('setup_time'), // minutes
  wastePercentage: decimal('waste_percentage', { precision: 4, scale: 2 }).default('5.00'), // %
  constraints: jsonb('constraints'), // Technical constraints and tolerances
  capabilities: jsonb('capabilities'), // What this machine can do
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }), // R$/hour
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Clients table
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }), // CNPJ/CPF
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  address: jsonb('address'),
  contactPerson: varchar('contact_person', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  notes: text('notes'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Quotes table
export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  salesPersonId: uuid('sales_person_id').references(() => users.id).notNull(),
  quoteNumber: varchar('quote_number', { length: 50 }).unique().notNull(),
  status: varchar('status', { length: 50 }).default('draft'), // draft, sent, approved, rejected, expired
  validUntil: timestamp('valid_until').notNull(),
  
  // Product information
  productName: varchar('product_name', { length: 255 }).notNull(),
  productWeight: decimal('product_weight', { precision: 8, scale: 3 }), // kg
  productImages: jsonb('product_images').default([]),
  
  // Box specifications
  boxType: varchar('box_type', { length: 50 }).notNull(), // fefco or custom
  fefcoCodeId: uuid('fefco_code_id').references(() => fefcoCodes.id),
  dimensions: jsonb('dimensions').notNull(), // L, W, H in mm
  materialId: uuid('material_id').references(() => materials.id).notNull(),
  
  // Requirements
  stackingHeight: integer('stacking_height'), // Number of boxes to stack
  shippingConditions: jsonb('shipping_conditions'), // Humidity, temperature, etc.
  storageConditions: jsonb('storage_conditions'),
  printSpecifications: jsonb('print_specifications'), // Colors, finishes, etc.
  logoFiles: jsonb('logo_files').default([]),
  
  // Calculations
  blankDimensions: jsonb('blank_dimensions'), // Calculated blank size
  compressionStrength: decimal('compression_strength', { precision: 8, scale: 2 }), // McKee result
  machineId: uuid('machine_id').references(() => machines.id),
  
  // Pricing
  quantities: jsonb('quantities').notNull(), // Array of quantity tiers
  pricing: jsonb('pricing').notNull(), // Pricing per quantity tier
  totalValue: decimal('total_value', { precision: 10, scale: 2 }),
  
  // Files
  dieline3dModel: text('dieline_3d_model'), // Path to 3D model file
  dielinePdf: text('dieline_pdf'), // Path to PDF dieline
  productionFiles: jsonb('production_files').default([]),
  
  // Approval tracking
  clientViewedAt: timestamp('client_viewed_at'),
  clientApprovedAt: timestamp('client_approved_at'),
  clientRejectedAt: timestamp('client_rejected_at'),
  clientComments: text('client_comments'),
  
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Quote revisions for version control
export const quoteRevisions = pgTable('quote_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quoteId: uuid('quote_id').references(() => quotes.id).notNull(),
  revision: integer('revision').notNull(),
  changes: jsonb('changes').notNull(), // What changed
  changedBy: uuid('changed_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Production orders
export const productionOrders = pgTable('production_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  quoteId: uuid('quote_id').references(() => quotes.id).notNull(),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, in_production, completed, cancelled
  quantity: integer('quantity').notNull(),
  priority: varchar('priority', { length: 20 }).default('normal'), // low, normal, high, urgent
  scheduledDate: timestamp('scheduled_date'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  materialConsumption: jsonb('material_consumption'),
  actualCosts: jsonb('actual_costs'),
  qualityNotes: text('quality_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Sales channels (Canal de vendas)
export const salesChannels = pgTable('sales_channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // online, presencial, telefone, whatsapp
  commission: decimal('commission', { precision: 5, scale: 2 }).default('0.00'), // %
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Cost centers (Centro de custo)
export const costCenters = pgTable('cost_centers', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentId: uuid('parent_id').references(() => costCenters.id),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Shipping companies (Transportadora)
export const shippingCompanies = pgTable('shipping_companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }), // CNPJ
  contact: jsonb('contact'), // phone, email, etc
  address: jsonb('address'),
  shippingRates: jsonb('shipping_rates'), // Rates by region/weight
  trackingApi: jsonb('tracking_api'), // API configuration for tracking
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Market segments (Segmento)
export const marketSegments = pgTable('market_segments', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  characteristics: jsonb('characteristics'), // Specific requirements
  defaultMargin: decimal('default_margin', { precision: 5, scale: 2 }), // %
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Payment methods (Forma de pagamento)
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // cash, card, transfer, check, financing
  installments: integer('installments').default(1),
  discountRate: decimal('discount_rate', { precision: 5, scale: 2 }).default('0.00'), // %
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).default('0.00'), // %
  days: integer('days').default(0), // Days for payment
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Manufacturers (Fabricante)
export const manufacturers = pgTable('manufacturers', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }), // CNPJ
  contact: jsonb('contact'),
  address: jsonb('address'),
  products: jsonb('products'), // What they manufacture
  certifications: jsonb('certifications'), // Quality certifications
  leadTime: integer('lead_time'), // Days
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Products (Produto)
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  unitOfMeasure: varchar('unit_of_measure', { length: 20 }).notNull(), // m2, kg, units
  cost: decimal('cost', { precision: 10, scale: 4 }),
  price: decimal('price', { precision: 10, scale: 4 }),
  specifications: jsonb('specifications'),
  images: jsonb('images').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Contact types (Tipo contato)
export const contactTypes = pgTable('contact_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Quote parameters (Parâmetros de orçamento)
export const quoteParameters = pgTable('quote_parameters', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // material, production, quality, etc
  value: jsonb('value').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Quote status (Status de orçamento)
export const quoteStatuses = pgTable('quote_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).default('#6B7280'), // Hex color
  description: text('description'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Development projects (Desenvolvimento)
export const developmentProjects = pgTable('development_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  quoteId: uuid('quote_id').references(() => quotes.id),
  projectNumber: varchar('project_number', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('analysis'), // analysis, design, prototype, testing, approved
  priority: varchar('priority', { length: 20 }).default('normal'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  estimatedHours: decimal('estimated_hours', { precision: 8, scale: 2 }),
  actualHours: decimal('actual_hours', { precision: 8, scale: 2 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  files: jsonb('files').default([]),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Compensations (Compensações)
export const compensations = pgTable('compensations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  developmentProjectId: uuid('development_project_id').references(() => developmentProjects.id),
  type: varchar('type', { length: 50 }).notNull(), // material, production, design
  description: text('description').notNull(),
  value: decimal('value', { precision: 10, scale: 4 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(),
  appliedAt: timestamp('applied_at'),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Printing plates (Clichê)
export const printingPlates = pgTable('printing_plates', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  developmentProjectId: uuid('development_project_id').references(() => developmentProjects.id),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // flexo, offset, digital
  size: jsonb('size'), // width, height
  colors: jsonb('colors'), // color specifications
  lineature: integer('lineature'), // Lines per inch
  cost: decimal('cost', { precision: 10, scale: 2 }),
  supplier: varchar('supplier', { length: 255 }),
  estimatedLife: integer('estimated_life'), // Number of impressions
  actualLife: integer('actual_life'),
  files: jsonb('files').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Cutting dies (Faca)
export const cuttingDies = pgTable('cutting_dies', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  developmentProjectId: uuid('development_project_id').references(() => developmentProjects.id),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // rotary, flatbed, laser
  size: jsonb('size'), // dimensions
  bladeType: varchar('blade_type', { length: 50 }), // steel type
  cost: decimal('cost', { precision: 10, scale: 2 }),
  supplier: varchar('supplier', { length: 255 }),
  estimatedLife: integer('estimated_life'), // Number of cuts
  actualLife: integer('actual_life'),
  maintenanceSchedule: jsonb('maintenance_schedule'),
  files: jsonb('files').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Production processes (Processo produção)
export const productionProcesses = pgTable('production_processes', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  developmentProjectId: uuid('development_project_id').references(() => developmentProjects.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  steps: jsonb('steps').notNull(), // Ordered list of production steps
  machineId: uuid('machine_id').references(() => machines.id),
  setupTime: integer('setup_time'), // minutes
  cycleTime: decimal('cycle_time', { precision: 8, scale: 2 }), // minutes per unit
  qualityChecks: jsonb('quality_checks'),
  safetyRequirements: jsonb('safety_requirements'),
  version: integer('version').default(1),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Security permissions (Segurança)
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(), // create, read, update, delete
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

// Role permissions
export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Audit log for compliance
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id'),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  materials: many(materials),
  machines: many(machines),
  clients: many(clients),
  quotes: many(quotes)
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  quotes: many(quotes),
  productionOrders: many(productionOrders)
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, { fields: [quotes.companyId], references: [companies.id] }),
  client: one(clients, { fields: [quotes.clientId], references: [clients.id] }),
  salesPerson: one(users, { fields: [quotes.salesPersonId], references: [users.id] }),
  fefcoCode: one(fefcoCodes, { fields: [quotes.fefcoCodeId], references: [fefcoCodes.id] }),
  material: one(materials, { fields: [quotes.materialId], references: [materials.id] }),
  machine: one(machines, { fields: [quotes.machineId], references: [machines.id] }),
  revisions: many(quoteRevisions),
  productionOrders: many(productionOrders)
}));
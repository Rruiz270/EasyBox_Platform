import Joi from 'joi';

// Validation schemas
const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(255).required(),
    companyName: Joi.string().min(2).max(255).required(),
    document: Joi.string().pattern(/^\d{14}$/).required() // CNPJ
  }),

  // Client schemas
  createClient: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    document: Joi.string().pattern(/^\d{11}$|^\d{14}$/).optional(), // CPF or CNPJ
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    whatsapp: Joi.string().max(20).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      number: Joi.string().optional(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().length(2).optional(),
      zipCode: Joi.string().pattern(/^\d{8}$/).optional(),
      country: Joi.string().default('BR')
    }).optional(),
    contactPerson: Joi.string().max(255).optional(),
    industry: Joi.string().max(100).optional(),
    notes: Joi.string().optional()
  }),

  updateClient: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    document: Joi.string().pattern(/^\d{11}$|^\d{14}$/).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    whatsapp: Joi.string().max(20).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      number: Joi.string().optional(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().length(2).optional(),
      zipCode: Joi.string().pattern(/^\d{8}$/).optional(),
      country: Joi.string().default('BR')
    }).optional(),
    contactPerson: Joi.string().max(255).optional(),
    industry: Joi.string().max(100).optional(),
    notes: Joi.string().optional(),
    isActive: Joi.boolean().optional()
  }),

  // Quote schemas
  createQuote: Joi.object({
    clientId: Joi.string().uuid().required(),
    productName: Joi.string().min(2).max(255).required(),
    productWeight: Joi.number().positive().optional(),
    productImages: Joi.array().items(Joi.string()).optional(),
    boxType: Joi.string().valid('fefco', 'custom').required(),
    fefcoCodeId: Joi.string().uuid().when('boxType', {
      is: 'fefco',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    dimensions: Joi.object({
      length: Joi.number().positive().required(),
      width: Joi.number().positive().required(),
      height: Joi.number().positive().required()
    }).required(),
    materialId: Joi.string().uuid().required(),
    stackingHeight: Joi.number().integer().positive().optional(),
    shippingConditions: Joi.object({
      humidity: Joi.number().min(0).max(100).optional(),
      temperature: Joi.number().optional(),
      duration: Joi.number().positive().optional()
    }).optional(),
    storageConditions: Joi.object({
      humidity: Joi.number().min(0).max(100).optional(),
      temperature: Joi.number().optional(),
      duration: Joi.number().positive().optional()
    }).optional(),
    printSpecifications: Joi.object({
      colors: Joi.array().items(Joi.string()).optional(),
      finishes: Joi.array().items(Joi.string()).optional(),
      pantones: Joi.array().items(Joi.string()).optional()
    }).optional(),
    quantities: Joi.array().items(
      Joi.object({
        quantity: Joi.number().integer().positive().required(),
        unitPrice: Joi.number().positive().optional(),
        totalPrice: Joi.number().positive().optional()
      })
    ).min(1).required(),
    validUntil: Joi.date().greater('now').required(),
    notes: Joi.string().optional()
  }),

  // McKee calculation schema
  calculateMcKee: Joi.object({
    ect: Joi.number().positive().required(),
    thickness: Joi.number().positive().required(),
    length: Joi.number().positive().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    environmental: Joi.object({
      humidity: Joi.number().min(0).max(100).optional(),
      temperature: Joi.number().optional()
    }).optional(),
    stacking: Joi.object({
      height: Joi.number().integer().positive().optional(),
      duration: Joi.number().positive().optional(),
      type: Joi.string().valid('regular', 'heavy_duty', 'export', 'food_grade').optional()
    }).optional()
  }),

  // Material schemas
  createMaterial: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    type: Joi.string().valid('single_face', 'single_wall', 'double_wall', 'triple_wall').required(),
    flute: Joi.string().valid('A', 'B', 'C', 'E', 'F', 'BC', 'EB', 'AC', 'AB').required(),
    ect: Joi.number().positive().required(),
    bct: Joi.number().positive().optional(),
    thickness: Joi.number().positive().required(),
    weight: Joi.number().positive().required(),
    costPerM2: Joi.number().positive().required(),
    supplier: Joi.string().max(255).optional(),
    specifications: Joi.object().optional()
  }),

  // User schemas
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(255).required(),
    role: Joi.string().valid('admin', 'sales', 'engineering', 'production', 'client').required(),
    phone: Joi.string().max(20).optional(),
    permissions: Joi.array().items(Joi.object()).optional()
  })
};

export const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        error: 'Schema de validação não encontrado',
        code: 'VALIDATION_SCHEMA_NOT_FOUND'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Dados de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details
      });
    }

    req.validatedData = value;
    next();
  };
};
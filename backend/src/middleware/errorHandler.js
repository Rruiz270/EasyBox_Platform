import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export const errorHandler = (err, req, res, next) => {
  // Log error with context
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    tenantId: req.tenantId,
    timestamp: new Date().toISOString()
  });

  // Database errors
  if (err.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      error: 'Registro já existe',
      code: 'DUPLICATE_ENTRY',
      details: 'Um registro com essas informações já foi cadastrado'
    });
  }

  if (err.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      error: 'Referência inválida',
      code: 'INVALID_REFERENCE',
      details: 'Tentativa de referenciar um registro que não existe'
    });
  }

  if (err.code === '23502') { // Not null constraint violation
    return res.status(400).json({
      error: 'Campo obrigatório',
      code: 'REQUIRED_FIELD',
      details: 'Um campo obrigatório não foi preenchido'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      details: err.details
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      code: 'FILE_TOO_LARGE',
      details: 'O arquivo excede o tamanho máximo permitido'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Arquivo não esperado',
      code: 'UNEXPECTED_FILE',
      details: 'Tipo de arquivo não permitido'
    });
  }

  // Rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Muitas tentativas',
      code: 'RATE_LIMIT_EXCEEDED',
      details: 'Aguarde antes de tentar novamente'
    });
  }

  // Business logic errors
  if (err.type === 'BUSINESS_ERROR') {
    return res.status(400).json({
      error: err.message,
      code: err.code || 'BUSINESS_ERROR',
      details: err.details
    });
  }

  // Permission errors
  if (err.type === 'PERMISSION_ERROR') {
    return res.status(403).json({
      error: 'Permissão negada',
      code: 'PERMISSION_DENIED',
      details: err.message
    });
  }

  // Default error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
    ...(isDevelopment && {
      details: err.message,
      stack: err.stack
    }),
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};
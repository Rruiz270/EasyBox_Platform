import express from 'express';

const router = express.Router();

// Simple test endpoint to verify deployment
router.get('/ping', (req, res) => {
  res.json({
    message: '🚀 EasyBox Platform API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Database connection test
router.get('/db-test', async (req, res) => {
  try {
    // Simple test without importing heavy dependencies
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'DATABASE_URL not configured',
        message: 'Please add your Neon database connection string to Railway environment variables'
      });
    }

    res.json({
      message: 'Database configuration found',
      hasConnection: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database test failed',
      message: error.message
    });
  }
});

// Environment check
router.get('/env-check', (req, res) => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const envStatus = requiredEnvVars.map(envVar => ({
    name: envVar,
    configured: !!process.env[envVar],
    value: envVar === 'JWT_SECRET' ? '[HIDDEN]' : process.env[envVar] ? '[SET]' : '[NOT SET]'
  }));

  const allConfigured = envStatus.every(env => env.configured);

  res.json({
    message: allConfigured ? '✅ All environment variables configured' : '⚠️ Missing environment variables',
    ready: allConfigured,
    environment: envStatus,
    timestamp: new Date().toISOString()
  });
});

export default router;
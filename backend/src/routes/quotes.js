import express from 'express';
const router = express.Router();

// Get all quotes
router.get('/', async (req, res) => {
  res.json({ message: 'Quotes route - coming soon' });
});

// Create quote
router.post('/', async (req, res) => {
  res.json({ message: 'Create quote - coming soon' });
});

export default router;
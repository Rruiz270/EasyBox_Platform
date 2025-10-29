import express from 'express';
const router = express.Router();

// Get all materials
router.get('/', async (req, res) => {
  res.json({ message: 'Materials route - coming soon' });
});

// Create material
router.post('/', async (req, res) => {
  res.json({ message: 'Create material - coming soon' });
});

export default router;
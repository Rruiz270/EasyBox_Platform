import express from 'express';
const router = express.Router();

// Get all machines
router.get('/', async (req, res) => {
  res.json({ message: 'Machines route - coming soon' });
});

// Create machine
router.post('/', async (req, res) => {
  res.json({ message: 'Create machine - coming soon' });
});

export default router;
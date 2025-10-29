import express from 'express';
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  res.json({ message: 'Clients route - coming soon' });
});

// Create client
router.post('/', async (req, res) => {
  res.json({ message: 'Create client - coming soon' });
});

export default router;
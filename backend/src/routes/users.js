import express from 'express';
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  res.json({ message: 'Users route - coming soon' });
});

// Create user
router.post('/', async (req, res) => {
  res.json({ message: 'Create user - coming soon' });
});

// Get user by ID
router.get('/:id', async (req, res) => {
  res.json({ message: `Get user ${req.params.id} - coming soon` });
});

// Update user
router.put('/:id', async (req, res) => {
  res.json({ message: `Update user ${req.params.id} - coming soon` });
});

// Delete user
router.delete('/:id', async (req, res) => {
  res.json({ message: `Delete user ${req.params.id} - coming soon` });
});

export default router;
import express from 'express';
const router = express.Router();

// Calculate McKee formula
router.post('/mckee', async (req, res) => {
  res.json({ message: 'McKee calculation - coming soon' });
});

// Calculate box dimensions
router.post('/dimensions', async (req, res) => {
  res.json({ message: 'Box dimensions calculation - coming soon' });
});

export default router;
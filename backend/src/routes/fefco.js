import express from 'express';
const router = express.Router();

// Get all FEFCO codes
router.get('/', async (req, res) => {
  res.json({ message: 'FEFCO codes route - coming soon' });
});

// Get FEFCO code by ID
router.get('/:code', async (req, res) => {
  res.json({ message: `Get FEFCO code ${req.params.code} - coming soon` });
});

export default router;
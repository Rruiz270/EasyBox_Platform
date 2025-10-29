import express from 'express';
const router = express.Router();

// Upload file
router.post('/upload', async (req, res) => {
  res.json({ message: 'File upload - coming soon' });
});

// Get file
router.get('/:id', async (req, res) => {
  res.json({ message: `Get file ${req.params.id} - coming soon` });
});

export default router;
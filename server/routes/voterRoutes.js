const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerVoter,
  getAllVoters,
  getVoterById,
  updateVoterStatus,
  deleteVoter,
  getStats,
} = require('../controllers/voterController');

// Multer config — store uploads in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `photo_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.get('/stats', getStats);
router.post('/register', upload.single('photo'), registerVoter);
router.get('/', getAllVoters);
router.get('/:id', getVoterById);
router.patch('/:id/status', updateVoterStatus);
router.delete('/:id', deleteVoter);

module.exports = router;

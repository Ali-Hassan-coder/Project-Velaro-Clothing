const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/single', protect, adminOnly, upload.single('image'), uploadSingle);
router.post('/multiple', protect, adminOnly, upload.array('images', 10), uploadMultiple);
router.delete('/', protect, adminOnly, deleteImage);

module.exports = router;

const catchAsync = require('../utils/catchAsync');
const uploadService = require('../services/uploadService');

const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  const result = await uploadService.uploadImage(req.file.buffer);
  res.json({ success: true, data: result });
});

const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded.' });
  }
  const results = await uploadService.uploadMultipleImages(req.files);
  res.json({ success: true, data: { images: results } });
});

const deleteImage = catchAsync(async (req, res) => {
  await uploadService.deleteImage(req.body.publicId);
  res.json({ success: true, message: 'Image deleted.' });
});

module.exports = { uploadSingle, uploadMultiple, deleteImage };

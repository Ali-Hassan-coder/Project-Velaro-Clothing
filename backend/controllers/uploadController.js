const catchAsync = require('../utils/catchAsync');
const uploadService = require('../services/uploadService');

const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const result = await uploadService.uploadMediaFile(req.file, 'velaro-clothing/media', hostUrl);
  res.json({ success: true, data: result });
});

const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded.' });
  }
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const results = await uploadService.uploadMultipleMedia(req.files, 'velaro-clothing/media', hostUrl);
  res.json({ success: true, data: { media: results, images: results } });
});

const deleteImage = catchAsync(async (req, res) => {
  await uploadService.deleteImage(req.body.publicId);
  res.json({ success: true, message: 'Media removed.' });
});

module.exports = { uploadSingle, uploadMultiple, deleteImage };


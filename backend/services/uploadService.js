const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload a media file (image or video)
 * If Cloudinary is configured, upload to Cloudinary. Otherwise, serve via local static URL.
 */
const uploadMediaFile = async (file, folder = 'velaro-clothing/media') => {
  const isVideo = file.mimetype.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key';

  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
        transformation: isVideo ? undefined : [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1600, crop: 'limit' },
        ],
      });
      // remove local temp file if Cloudinary succeeds
      try { fs.unlinkSync(file.path); } catch {}
      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType,
      };
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local file:', err.message);
    }
  }

  // Fallback: local static server url
  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return {
    url: `${serverUrl}/uploads/${file.filename}`,
    publicId: file.filename,
    resourceType,
  };
};

/**
 * Upload multiple media files
 */
const uploadMultipleMedia = async (files, folder = 'velaro-clothing/media') => {
  const uploadPromises = files.map((file) => uploadMediaFile(file, folder));
  return Promise.all(uploadPromises);
};

/**
 * Delete media
 */
const deleteImage = async (publicId) => {
  try {
    if (publicId && publicId.includes('-')) {
      const path = require('path');
      const localPath = path.join(__dirname, '..', 'uploads', publicId);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  uploadMediaFile,
  uploadMultipleMedia,
  uploadImage: uploadMediaFile,
  uploadMultipleImages: uploadMultipleMedia,
  deleteImage,
};


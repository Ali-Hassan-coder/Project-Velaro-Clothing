const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

/**
 * Upload a single image to Cloudinary
 */
const uploadImage = async (fileBuffer, folder = 'velaro-clothing/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new AppError('Image upload failed.', 500));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 */
const uploadMultipleImages = async (files, folder = 'velaro-clothing/products') => {
  const uploadPromises = files.map((file) => uploadImage(file.buffer, folder));
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};

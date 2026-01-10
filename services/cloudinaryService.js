// ========================================
// ☁️ CLOUDINARY IMAGE UPLOAD SERVICE
// Free alternative to Firebase Storage
// ========================================

// ⚠️ SETUP REQUIRED:
// 1. Buat akun di https://cloudinary.com (GRATIS)
// 2. Dari Dashboard, copy:
//    - Cloud Name
//    - API Key  
//    - API Secret
// 3. Buat Upload Preset (unsigned):
//    - Settings > Upload > Upload Presets > Add upload preset
//    - Signing Mode: Unsigned
//    - Folder: gudang_resep (optional)
//    - Save dan copy preset name
// 4. Isi credentials di bawah:

const CLOUDINARY_CONFIG = {
  cloudName: 'ddi0qglff',      // Ganti dengan cloud name kamu
  uploadPreset: 'gudang_resep', // Ganti dengan upload preset kamu
};

/**
 * Upload image to Cloudinary
 * @param {string} imageUri - Local image URI from ImagePicker
 * @param {string} folder - Folder name in Cloudinary (e.g., 'profile_photos', 'artikel_thumbnails')
 * @returns {Promise<{success: boolean, imageUrl?: string, error?: string}>}
 */
export const uploadImageToCloudinary = async (imageUri, folder = 'uploads') => {
  try {
    console.log('☁️ [Cloudinary] Starting upload...');
    console.log('☁️ [Cloudinary] Image URI:', imageUri);
    console.log('☁️ [Cloudinary] Folder:', folder);

    // Validate config
    if (CLOUDINARY_CONFIG.cloudName === 'YOUR_CLOUD_NAME' || 
        CLOUDINARY_CONFIG.uploadPreset === 'YOUR_UPLOAD_PRESET') {
      console.error('❌ [Cloudinary] Config not set! Please update CLOUDINARY_CONFIG');
      return {
        success: false,
        error: 'Cloudinary belum dikonfigurasi. Silakan isi Cloud Name dan Upload Preset.'
      };
    }

    // Create form data
    const formData = new FormData();
    
    // Get filename from URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append file
    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename || `image_${Date.now()}.jpg`,
    });
    
    // Append upload preset (required for unsigned uploads)
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Optional: specify folder
    formData.append('folder', folder);

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    
    console.log('☁️ [Cloudinary] Uploading to:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    console.log('☁️ [Cloudinary] Response:', JSON.stringify(data, null, 2));

    if (data.secure_url) {
      console.log('✅ [Cloudinary] Upload successful!');
      console.log('✅ [Cloudinary] URL:', data.secure_url);
      return {
        success: true,
        imageUrl: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      console.error('❌ [Cloudinary] Upload failed:', data.error?.message);
      return {
        success: false,
        error: data.error?.message || 'Upload gagal'
      };
    }
  } catch (error) {
    console.error('❌ [Cloudinary] Error:', error);
    return {
      success: false,
      error: error.message || 'Gagal upload gambar ke Cloudinary'
    };
  }
};

/**
 * Upload profile photo to Cloudinary
 * @param {string} userId - User ID for naming
 * @param {string} imageUri - Local image URI
 * @returns {Promise<{success: boolean, photoURL?: string, error?: string}>}
 */
export const uploadProfilePhotoToCloudinary = async (userId, imageUri) => {
  console.log('📸 [Cloudinary] Uploading profile photo for user:', userId);
  
  const result = await uploadImageToCloudinary(imageUri, 'profile_photos');
  
  if (result.success) {
    return {
      success: true,
      photoURL: result.imageUrl,
    };
  }
  
  return result;
};

/**
 * Upload artikel thumbnail to Cloudinary
 * @param {string} userId - User ID for naming
 * @param {string} imageUri - Local image URI
 * @returns {Promise<{success: boolean, thumbnailURL?: string, error?: string}>}
 */
export const uploadArtikelThumbnailToCloudinary = async (userId, imageUri) => {
  console.log('🖼️ [Cloudinary] Uploading artikel thumbnail for user:', userId);
  
  const result = await uploadImageToCloudinary(imageUri, 'artikel_thumbnails');
  
  if (result.success) {
    return {
      success: true,
      thumbnailURL: result.imageUrl,
    };
  }
  
  return result;
};

// Export config checker
export const isCloudinaryConfigured = () => {
  return CLOUDINARY_CONFIG.cloudName !== 'YOUR_CLOUD_NAME' && 
         CLOUDINARY_CONFIG.uploadPreset !== 'YOUR_UPLOAD_PRESET';
};

export default {
  uploadImageToCloudinary,
  uploadProfilePhotoToCloudinary,
  uploadArtikelThumbnailToCloudinary,
  isCloudinaryConfigured,
};

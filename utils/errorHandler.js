// ========================================
// 🚨 ERROR HANDLER UTILITIES
// Helper untuk handle Firebase errors dan convert ke user-friendly messages
// ========================================

/**
 * Convert Firebase error code ke pesan Indonesia yang user-friendly
 * @param {string} errorCode - Firebase error code
 * @returns {string} - Pesan error dalam bahasa Indonesia
 */
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // Auth Errors
    'auth/email-already-in-use': 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
    'auth/invalid-email': 'Format email tidak valid. Periksa kembali email Anda.',
    'auth/user-not-found': 'Email tidak terdaftar. Silakan daftar terlebih dahulu.',
    'auth/wrong-password': 'Password salah. Silakan coba lagi.',
    'auth/weak-password': 'Password terlalu lemah. Gunakan minimal 6 karakter.',
    'auth/invalid-credential': 'Email atau password salah. Silakan coba lagi.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
    'auth/user-disabled': 'Akun ini telah dinonaktifkan. Hubungi admin.',
    'auth/operation-not-allowed': 'Operasi tidak diizinkan. Hubungi admin.',
    'auth/network-request-failed': 'Koneksi internet bermasalah. Periksa koneksi Anda.',
    'auth/requires-recent-login': 'Silakan login ulang untuk melanjutkan.',
    'auth/configuration-not-found': '⚠️ PENTING: Authentication belum di-enable di Firebase Console!\n\n📋 Langkah perbaikan:\n1. Buka https://console.firebase.google.com/project/gudang-resep-52474\n2. Klik "Authentication" di sidebar\n3. Klik tab "Sign-in method"\n4. Enable "Email/Password"\n5. Klik "Save"\n\nSetelah itu restart app.',
    
    // Firestore Errors
    'permission-denied': 'Anda tidak memiliki akses untuk melakukan operasi ini.',
    'not-found': 'Data tidak ditemukan.',
    'already-exists': 'Data sudah ada.',
    'resource-exhausted': 'Terlalu banyak request. Silakan coba lagi nanti.',
    'failed-precondition': 'Operasi gagal. Silakan coba lagi.',
    'aborted': 'Operasi dibatalkan. Silakan coba lagi.',
    'out-of-range': 'Data di luar jangkauan yang diizinkan.',
    'unimplemented': 'Fitur ini belum tersedia.',
    'internal': 'Terjadi kesalahan server. Silakan coba lagi.',
    'unavailable': 'Layanan tidak tersedia. Silakan coba lagi nanti.',
    'data-loss': 'Terjadi kehilangan data. Hubungi admin.',
    
    // Network Errors
    'network-error': 'Koneksi internet bermasalah. Periksa koneksi Anda.',
    'timeout': 'Request timeout. Silakan coba lagi.',
  };

  return errorMessages[errorCode] || 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Handle error dari Firebase dan return formatted error
 * @param {Error} error - Error object dari Firebase
 * @returns {object} - { message, code }
 */
export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  const errorCode = error.code || 'unknown';
  const errorMessage = getFirebaseErrorMessage(errorCode);
  
  return {
    code: errorCode,
    message: errorMessage,
    originalError: error,
  };
};

/**
 * Validasi format email
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} - true jika valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validasi password strength
 * @param {string} password - Password yang akan divalidasi
 * @returns {object} - { valid, message }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: 'Password minimal 6 karakter'
    };
  }
  
  return {
    valid: true,
    message: 'Password valid'
  };
};

/**
 * Validasi nama
 * @param {string} nama - Nama yang akan divalidasi
 * @returns {object} - { valid, message }
 */
export const validateName = (nama) => {
  if (!nama || nama.trim().length < 3) {
    return {
      valid: false,
      message: 'Nama minimal 3 karakter'
    };
  }
  
  return {
    valid: true,
    message: 'Nama valid'
  };
};

/**
 * Validasi confirm password match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm Password
 * @returns {object} - { valid, message }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      valid: false,
      message: 'Password tidak cocok'
    };
  }
  
  return {
    valid: true,
    message: 'Password cocok'
  };
};

/**
 * Validasi form register
 * @param {object} formData - { nama, email, password, confirmPassword }
 * @returns {object} - { valid, errors }
 */
export const validateRegisterForm = (formData) => {
  const errors = {};
  let valid = true;
  
  // Validasi nama
  const nameValidation = validateName(formData.nama);
  if (!nameValidation.valid) {
    errors.nama = nameValidation.message;
    valid = false;
  }
  
  // Validasi email
  if (!isValidEmail(formData.email)) {
    errors.email = 'Format email tidak valid';
    valid = false;
  }
  
  // Validasi password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
    valid = false;
  }
  
  // Validasi confirm password
  const matchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (!matchValidation.valid) {
    errors.confirmPassword = matchValidation.message;
    valid = false;
  }
  
  return { valid, errors };
};

/**
 * Validasi form login
 * @param {object} formData - { email, password }
 * @returns {object} - { valid, errors }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  let valid = true;
  
  // Validasi email
  if (!isValidEmail(formData.email)) {
    errors.email = 'Format email tidak valid';
    valid = false;
  }
  
  // Validasi password tidak kosong
  if (!formData.password || formData.password.length === 0) {
    errors.password = 'Password tidak boleh kosong';
    valid = false;
  }
  
  return { valid, errors };
};

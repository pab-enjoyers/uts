// ========================================
// 🔧 AUTH HELPERS
// Additional helper functions untuk auth operations
// ========================================

import { auth } from '../config/firebaseConfig';
import { 
  updatePassword, 
  updateEmail, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { handleFirebaseError } from './errorHandler';
import { deleteUserProfile } from '../services/userService';

/**
 * Update password user
 * @param {string} currentPassword - Password lama
 * @param {string} newPassword - Password baru
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      };
    }

    // Reauthenticate user dulu
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return {
      success: true,
      message: 'Password berhasil diupdate'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Update email user
 * @param {string} newEmail - Email baru
 * @param {string} password - Password untuk reauthenticate
 */
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      };
    }

    // Reauthenticate user dulu
    const credential = EmailAuthProvider.credential(
      user.email,
      password
    );
    
    await reauthenticateWithCredential(user, credential);
    
    // Update email
    await updateEmail(user, newEmail);
    
    return {
      success: true,
      message: 'Email berhasil diupdate'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Delete user account
 * @param {string} password - Password untuk konfirmasi
 */
export const deleteUserAccount = async (password) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      };
    }

    // Reauthenticate user dulu
    const credential = EmailAuthProvider.credential(
      user.email,
      password
    );
    
    await reauthenticateWithCredential(user, credential);
    
    // Delete user profile dari Firestore
    await deleteUserProfile(user.uid);
    
    // Delete user dari Firebase Auth
    await deleteUser(user);
    
    return {
      success: true,
      message: 'Akun berhasil dihapus'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Check if user email is verified
 */
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get user ID token
 */
export const getUserIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return {
        success: true,
        token
      };
    }
    return {
      success: false,
      error: 'User tidak login'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

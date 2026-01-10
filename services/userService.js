// ========================================
// 📝 USER SERVICE - FIRESTORE OPERATIONS
// CRUD operations untuk user profile di Firestore
// ========================================

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { handleFirebaseError } from '../utils/errorHandler';

// Collection name
const USERS_COLLECTION = 'users';

/**
 * Create user profile di Firestore
 * @param {string} uid - User ID dari Firebase Auth
 * @param {object} userData - Data user { nama, email, dll }
 */
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    
    const profileData = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(userRef, profileData);
    
    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error creating user profile:', errorInfo);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Get user profile dari Firestore
 * @param {string} uid - User ID
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        success: true,
        data: userSnap.data()
      };
    } else {
      return {
        success: false,
        error: 'User profile not found'
      };
    }
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error getting user profile:', errorInfo);
    return {
      success: false,
      error: errorInfo.message,
      data: null
    };
  }
};

/**
 * Update user profile di Firestore
 * @param {string} uid - User ID
 * @param {object} updates - Data yang akan diupdate
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await updateDoc(userRef, updateData);
    
    return {
      success: true,
      data: updateData
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error updating user profile:', errorInfo);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Delete user profile dari Firestore
 * @param {string} uid - User ID
 */
export const deleteUserProfile = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(userRef);
    
    return {
      success: true
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error deleting user profile:', errorInfo);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

/**
 * Get user by email
 * @param {string} email - Email user
 */
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return {
        success: true,
        data: userData
      };
    } else {
      return {
        success: false,
        error: 'User not found'
      };
    }
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error getting user by email:', errorInfo);
    return {
      success: false,
      error: errorInfo.message
    };
  }
};

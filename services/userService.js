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
  getDocs,
  orderBy,
  Timestamp
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

// ========================================
// 🔖 BOOKMARKS / FAVORITES FUNCTIONS
// Firebase Firestore subcollection: users/{uid}/bookmarks
// ========================================

/**
 * Add meal to bookmarks
 * @param {string} uid - User ID
 * @param {Object} mealData - Meal data dari API { idMeal, strMeal, strMealThumb, strCategory, strArea }
 * @returns {Object} { success, message }
 */
export const addBookmark = async (uid, mealData) => {
  try {
    if (!uid || !mealData || !mealData.idMeal) {
      return {
        success: false,
        error: 'Data tidak lengkap'
      };
    }

    const bookmarkRef = doc(db, USERS_COLLECTION, uid, 'bookmarks', mealData.idMeal);
    
    const bookmarkData = {
      mealId: mealData.idMeal,
      mealName: mealData.strMeal || mealData.name || 'Unknown',
      mealThumb: mealData.strMealThumb || mealData.thumbnail || '',
      category: mealData.strCategory || mealData.category || '',
      area: mealData.strArea || mealData.area || '',
      bookmarkedAt: Timestamp.now()
    };
    
    await setDoc(bookmarkRef, bookmarkData);
    
    return {
      success: true,
      message: 'Resep berhasil ditambahkan ke bookmark'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error adding bookmark:', errorInfo);
    return {
      success: false,
      error: errorInfo.message || 'Gagal menambahkan bookmark'
    };
  }
};

/**
 * Remove meal from bookmarks
 * @param {string} uid - User ID
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, message }
 */
export const removeBookmark = async (uid, mealId) => {
  try {
    if (!uid || !mealId) {
      return {
        success: false,
        error: 'Data tidak lengkap'
      };
    }

    const bookmarkRef = doc(db, USERS_COLLECTION, uid, 'bookmarks', mealId);
    await deleteDoc(bookmarkRef);
    
    return {
      success: true,
      message: 'Bookmark berhasil dihapus'
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error removing bookmark:', errorInfo);
    return {
      success: false,
      error: errorInfo.message || 'Gagal menghapus bookmark'
    };
  }
};

/**
 * Get all bookmarks for a user
 * @param {string} uid - User ID
 * @returns {Object} { success, bookmarks: [] }
 */
export const getBookmarks = async (uid) => {
  try {
    if (!uid) {
      return {
        success: false,
        error: 'User ID tidak valid',
        bookmarks: []
      };
    }

    const bookmarksRef = collection(db, USERS_COLLECTION, uid, 'bookmarks');
    const q = query(bookmarksRef, orderBy('bookmarkedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookmarks = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      bookmarks
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('Error getting bookmarks:', errorInfo);
    return {
      success: false,
      error: errorInfo.message || 'Gagal mengambil bookmarks',
      bookmarks: []
    };
  }
};

/**
 * Check if a meal is bookmarked
 * @param {string} uid - User ID
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, isBookmarked: boolean }
 */
export const isBookmarked = async (uid, mealId) => {
  try {
    if (!uid || !mealId) {
      return {
        success: true,
        isBookmarked: false
      };
    }

    const bookmarkRef = doc(db, USERS_COLLECTION, uid, 'bookmarks', mealId);
    const bookmarkSnap = await getDoc(bookmarkRef);
    
    return {
      success: true,
      isBookmarked: bookmarkSnap.exists()
    };
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return {
      success: true,
      isBookmarked: false
    };
  }
};

/**
 * Get bookmark count for a user
 * @param {string} uid - User ID
 * @returns {Object} { success, count: number }
 */
export const getBookmarkCount = async (uid) => {
  try {
    const result = await getBookmarks(uid);
    
    if (result.success) {
      return {
        success: true,
        count: result.bookmarks.length
      };
    }
    
    return {
      success: false,
      count: 0
    };
  } catch (error) {
    console.error('Error getting bookmark count:', error);
    return {
      success: false,
      count: 0
    };
  }
};

/**
 * ALIAS: Add to favorites (same as bookmark)
 */
export const addFavorite = addBookmark;

/**
 * ALIAS: Remove from favorites (same as bookmark)
 */
export const removeFavorite = removeBookmark;

/**
 * ALIAS: Get favorites (same as bookmarks)
 */
export const getFavorites = getBookmarks;

/**
 * ALIAS: Check if favorited (same as bookmarked)
 */
export const isFavorited = isBookmarked;

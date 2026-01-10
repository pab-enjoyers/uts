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
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';
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
 * Upload profile photo ke Firebase Storage
 * @param {string} uid - User ID
 * @param {string} imageUri - Local image URI
 */
export const uploadProfilePhoto = async (uid, imageUri) => {
  try {
    console.log('📸 Starting profile photo upload for:', uid);
    console.log('📸 Image URI:', imageUri);
    
    // Check if storage is available
    if (!storage) {
      console.error('❌ Firebase Storage not initialized');
      return {
        success: false,
        error: 'Firebase Storage tidak tersedia. Periksa konfigurasi Firebase.'
      };
    }
    
    // Convert image URI to blob
    console.log('📸 Fetching image...');
    const response = await fetch(imageUri);
    const blob = await response.blob();
    console.log('📸 Blob created, size:', blob.size);
    
    // Create reference to storage
    const filename = `profile_${uid}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `profile_photos/${filename}`);
    console.log('📸 Storage ref created:', filename);
    
    // Upload file
    console.log('📸 Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);
    console.log('📸 Upload complete!');
    
    // Get download URL
    console.log('📸 Getting download URL...');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('📸 Download URL:', downloadURL);
    
    // Update user profile with photo URL
    console.log('📸 Updating user profile...');
    await updateUserProfile(uid, { photoURL: downloadURL });
    console.log('📸 Profile updated successfully!');
    
    return {
      success: true,
      photoURL: downloadURL
    };
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('❌ Error uploading profile photo:', errorInfo);
    console.error('❌ Full error:', error);
    
    // Check for specific storage errors
    if (error.code === 'storage/unauthorized') {
      return {
        success: false,
        error: 'Tidak memiliki izin untuk upload. Periksa Firebase Storage Rules.'
      };
    } else if (error.code === 'storage/unknown') {
      return {
        success: false,
        error: 'Error Firebase Storage. Pastikan Storage Rules sudah diatur dengan benar.'
      };
    }
    
    return {
      success: false,
      error: errorInfo.message || 'Gagal upload foto profil'
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

// ========================================
// ⭐ RATING & REVIEW SYSTEM
// ========================================

/**
 * Add or update rating for a meal
 * @param {string} uid - User ID
 * @param {string} mealId - Meal ID
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Review text (optional)
 * @param {string} mealName - Name of the meal (optional)
 * @param {string} mealThumb - Thumbnail URL of the meal (optional)
 * @returns {Object} { success, message }
 */
export const addRating = async (uid, mealId, rating, review = '', mealName = '', mealThumb = '') => {
  try {
    if (!uid || !mealId) {
      return { success: false, message: 'User ID dan Meal ID diperlukan' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: 'Rating harus antara 1-5' };
    }

    // Get user name and photo from profile
    let userName = 'Anonymous';
    let userPhotoURL = '';
    try {
      const userProfile = await getUserProfile(uid);
      if (userProfile.success && userProfile.data) {
        userName = userProfile.data.nama || userProfile.data.displayName || userProfile.data.email || 'Anonymous';
        userPhotoURL = userProfile.data.photoURL || '';
      }
    } catch (error) {
      console.log('Could not fetch user name:', error);
    }

    const ratingRef = doc(db, 'ratings', mealId, 'userRatings', uid);
    
    const ratingData = {
      uid,
      mealId,
      mealName: mealName || 'Resep',
      mealThumb: mealThumb || '',
      rating: Number(rating),
      review: review || '',
      userName,
      userPhotoURL,
      likes: 0,
      likedBy: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(ratingRef, ratingData);
    
    // Also save to user's reviewedMeals array for easier querying
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const reviewedMeals = userData.reviewedMeals || [];
      if (!reviewedMeals.includes(mealId)) {
        await updateDoc(userRef, {
          reviewedMeals: [...reviewedMeals, mealId]
        });
      }
    }
    
    return {
      success: true,
      message: 'Rating berhasil disimpan',
      data: ratingData
    };
  } catch (error) {
    console.error('Error adding rating:', error);
    return {
      success: false,
      message: 'Gagal menyimpan rating'
    };
  }
};

/**
 * Get average rating for a meal
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, rating: number, count: number }
 */
export const getAverageRating = async (mealId) => {
  try {
    if (!mealId) {
      return { success: false, rating: 0, count: 0 };
    }

    const ratingsRef = collection(db, 'ratings', mealId, 'userRatings');
    const snapshot = await getDocs(ratingsRef);
    
    if (snapshot.empty) {
      // No ratings yet, return default rating 4.0
      return {
        success: true,
        rating: 4.0,
        count: 0
      };
    }
    
    let totalRating = 0;
    let count = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      totalRating += data.rating || 0;
      count++;
    });
    
    const averageRating = count > 0 ? (totalRating / count) : 4.0;
    
    return {
      success: true,
      rating: Number(averageRating.toFixed(1)),
      count
    };
  } catch (error) {
    console.log('Error getting average rating:', error);
    // Return default rating on error
    return {
      success: true,
      rating: 4.0,
      count: 0
    };
  }
};

/**
 * Get user's rating for a meal
 * @param {string} uid - User ID
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, rating: number, review: string }
 */
export const getUserRating = async (uid, mealId) => {
  try {
    if (!uid || !mealId) {
      return { success: false, rating: 0, review: '' };
    }

    const ratingRef = doc(db, 'ratings', mealId, 'userRatings', uid);
    const ratingDoc = await getDoc(ratingRef);
    
    if (ratingDoc.exists()) {
      const data = ratingDoc.data();
      return {
        success: true,
        rating: data.rating || 0,
        review: data.review || '',
        createdAt: data.createdAt
      };
    }
    
    return {
      success: true,
      rating: 0,
      review: ''
    };
  } catch (error) {
    console.log('Error getting user rating:', error);
    return {
      success: false,
      rating: 0,
      review: ''
    };
  }
};

/**
 * Get all ratings for a meal
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, ratings: [] }
 */
export const getMealRatings = async (mealId) => {
  try {
    if (!mealId) {
      return { success: false, ratings: [] };
    }

    const ratingsRef = collection(db, 'ratings', mealId, 'userRatings');
    const q = query(ratingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const ratings = [];
    snapshot.forEach((doc) => {
      ratings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      ratings
    };
  } catch (error) {
    console.log('Error getting meal ratings:', error);
    return {
      success: false,
      ratings: []
    };
  }
};

/**
 * Delete user's rating
 * @param {string} uid - User ID
 * @param {string} mealId - Meal ID
 * @returns {Object} { success, message }
 */
export const deleteRating = async (uid, mealId) => {
  try {
    if (!uid || !mealId) {
      return { success: false, message: 'User ID dan Meal ID diperlukan' };
    }

    const ratingRef = doc(db, 'ratings', mealId, 'userRatings', uid);
    await deleteDoc(ratingRef);
    
    return {
      success: true,
      message: 'Rating berhasil dihapus'
    };
  } catch (error) {
    console.error('Error deleting rating:', error);
    return {
      success: false,
      message: 'Gagal menghapus rating'
    };
  }
};

/**
 * Toggle like on a review
 * @param {string} mealId - Meal ID
 * @param {string} reviewerId - Reviewer's user ID
 * @param {string} currentUserId - Current user's ID who is liking
 * @returns {Object} { success, message }
 */
export const toggleReviewLike = async (mealId, reviewerId, currentUserId) => {
  try {
    if (!mealId || !reviewerId || !currentUserId) {
      return { success: false, message: 'Missing required parameters' };
    }

    const ratingRef = doc(db, 'ratings', mealId, 'userRatings', reviewerId);
    const ratingDoc = await getDoc(ratingRef);
    
    if (!ratingDoc.exists()) {
      return { success: false, message: 'Review tidak ditemukan' };
    }

    const data = ratingDoc.data();
    const likedBy = data.likedBy || [];
    const currentLikes = data.likes || 0;

    let newLikedBy;
    let newLikes;

    if (likedBy.includes(currentUserId)) {
      // Unlike
      newLikedBy = likedBy.filter(id => id !== currentUserId);
      newLikes = Math.max(0, currentLikes - 1);
    } else {
      // Like
      newLikedBy = [...likedBy, currentUserId];
      newLikes = currentLikes + 1;
    }

    await updateDoc(ratingRef, {
      likedBy: newLikedBy,
      likes: newLikes,
      updatedAt: Timestamp.now()
    });

    return {
      success: true,
      message: 'Like berhasil diperbarui'
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      message: 'Gagal memperbarui like'
    };
  }
};

// ========================================
// 🔔 NOTIFICATION SYSTEM
// ========================================

/**
 * Add notification for user
 * @param {string} uid - User ID
 * @param {object} notificationData - { title, message, type, mealId }
 * @returns {Object} { success, message }
 */
export const addNotification = async (uid, notificationData) => {
  try {
    console.log('🔵 ========== ADD NOTIFICATION START ==========');
    console.log('🔵 User ID:', uid);
    console.log('🔵 Notification data:', JSON.stringify(notificationData, null, 2));
    
    if (!uid) {
      console.error('❌ addNotification: User ID diperlukan');
      return { success: false, message: 'User ID diperlukan' };
    }

    if (!db) {
      console.error('❌ addNotification: Firebase DB tidak tersedia');
      return { success: false, message: 'Firebase DB tidak tersedia' };
    }

    console.log('🔵 Creating notificationsRef...');
    const notificationsRef = collection(db, 'users', uid, 'notifications');
    console.log('🔵 notificationsRef created:', notificationsRef.path);
    
    const notifDoc = {
      ...notificationData,
      read: false,
      createdAt: Timestamp.now(),
      readAt: null,
    };
    console.log('🔵 Document to save:', JSON.stringify(notifDoc, null, 2));
    
    console.log('🔵 Calling addDoc...');
    const docRef = await addDoc(notificationsRef, notifDoc);
    
    console.log('✅ ========== NOTIFICATION SAVED SUCCESSFULLY ==========');
    console.log('✅ Document ID:', docRef.id);
    console.log('✅ Document path:', docRef.path);
    
    return {
      success: true,
      message: 'Notifikasi berhasil ditambahkan',
      notificationId: docRef.id
    };
  } catch (error) {
    console.error('❌ ========== ADD NOTIFICATION ERROR ==========');
    console.error('❌ Error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return {
      success: false,
      message: 'Gagal menambahkan notifikasi',
      error: error.message
    };
  }
};

/**
 * Get all notifications for user
 * @param {string} uid - User ID
 * @returns {Object} { success, notifications: [] }
 */
export const getNotifications = async (uid) => {
  try {
    if (!uid) {
      return { success: false, notifications: [] };
    }

    const notificationsRef = collection(db, 'users', uid, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const notifications = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        ...data,
        // Format createdAt to relative time
        time: formatRelativeTime(data.createdAt),
      });
    });
    
    return {
      success: true,
      notifications
    };
  } catch (error) {
    console.log('Error getting notifications:', error);
    return {
      success: false,
      notifications: []
    };
  }
};

/**
 * Mark notification as read
 * @param {string} uid - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Object} { success, message }
 */
export const markNotificationAsRead = async (uid, notificationId) => {
  try {
    if (!uid || !notificationId) {
      return { success: false, message: 'User ID dan Notification ID diperlukan' };
    }

    const notifRef = doc(db, 'users', uid, 'notifications', notificationId);
    await updateDoc(notifRef, {
      read: true,
      readAt: Timestamp.now(),
    });
    
    return {
      success: true,
      message: 'Notifikasi ditandai sudah dibaca'
    };
  } catch (error) {
    console.error('Error marking notification:', error);
    return {
      success: false,
      message: 'Gagal menandai notifikasi'
    };
  }
};

/**
 * Delete notification
 * @param {string} uid - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Object} { success, message }
 */
export const deleteNotification = async (uid, notificationId) => {
  try {
    if (!uid || !notificationId) {
      return { success: false, message: 'User ID dan Notification ID diperlukan' };
    }

    const notifRef = doc(db, 'users', uid, 'notifications', notificationId);
    await deleteDoc(notifRef);
    
    return {
      success: true,
      message: 'Notifikasi berhasil dihapus'
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      message: 'Gagal menghapus notifikasi'
    };
  }
};

/**
 * Get unread notification count
 * @param {string} uid - User ID
 * @returns {Object} { success, count: number }
 */
export const getUnreadNotificationCount = async (uid) => {
  try {
    if (!uid) {
      return { success: false, count: 0 };
    }

    const notificationsRef = collection(db, 'users', uid, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snapshot = await getDocs(q);
    
    return {
      success: true,
      count: snapshot.size
    };
  } catch (error) {
    console.log('Error getting unread count:', error);
    return {
      success: false,
      count: 0
    };
  }
};

/**
 * Mark ALL notifications as read
 * @param {string} uid - User ID
 * @returns {Object} { success, message, markedCount }
 */
export const markAllNotificationsAsRead = async (uid) => {
  try {
    if (!uid) {
      return { success: false, message: 'User ID diperlukan' };
    }

    const notificationsRef = collection(db, 'users', uid, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snapshot = await getDocs(q);
    
    let markedCount = 0;
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const notifRef = doc(db, 'users', uid, 'notifications', docSnap.id);
      await updateDoc(notifRef, {
        read: true,
        readAt: Timestamp.now(),
      });
      markedCount++;
    });
    
    await Promise.all(updatePromises);
    
    return {
      success: true,
      message: `${markedCount} notifikasi ditandai sudah dibaca`,
      markedCount
    };
  } catch (error) {
    console.error('Error marking all notifications:', error);
    return {
      success: false,
      message: 'Gagal menandai semua notifikasi'
    };
  }
};

/**
 * Helper: Format timestamp to relative time
 */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Baru saja';
  
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
};

/**
 * Get all reviews/ratings by a specific user
 * @param {string} uid - User ID
 * @returns {Object} { success, reviews: [] }
 */
export const getUserReviews = async (uid) => {
  try {
    if (!uid) {
      return { success: false, reviews: [] };
    }

    console.log('📝 Getting reviews for user:', uid);
    
    // Get user's reviewedMeals from their profile
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('📝 User not found');
      return { success: true, reviews: [] };
    }
    
    const userData = userSnap.data();
    let reviewedMeals = userData.reviewedMeals || [];
    
    console.log('📝 User has', reviewedMeals.length, 'meals in reviewedMeals');
    
    // If reviewedMeals is empty, try to sync from existing ratings
    // This handles legacy data before we started tracking reviewedMeals
    if (reviewedMeals.length === 0) {
      console.log('📝 Checking for legacy ratings to sync...');
      reviewedMeals = await syncUserReviewedMeals(uid);
    }
    
    if (reviewedMeals.length === 0) {
      return { success: true, reviews: [] };
    }
    
    const reviews = [];
    
    // For each mealId in reviewedMeals, get the rating
    for (const mealId of reviewedMeals) {
      try {
        const userRatingRef = doc(db, 'ratings', mealId, 'userRatings', uid);
        const userRatingSnap = await getDoc(userRatingRef);
        
        if (userRatingSnap.exists()) {
          const data = userRatingSnap.data();
          console.log('📝 Found review for meal:', mealId, 'rating:', data.rating);
          
          reviews.push({
            id: userRatingSnap.id,
            mealId: mealId,
            mealName: data.mealName || 'Resep',
            mealThumb: data.mealThumb || '',
            rating: data.rating || 0,
            review: data.review || '',
            userName: data.userName || 'Anonymous',
            userPhotoURL: data.userPhotoURL || '',
            createdAt: data.createdAt,
            likes: data.likes || 0,
          });
        }
      } catch (err) {
        console.log('Error checking rating for meal:', mealId);
      }
    }
    
    // Sort by createdAt descending
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    console.log('📝 Found', reviews.length, 'reviews for user');
    
    return {
      success: true,
      reviews
    };
  } catch (error) {
    console.error('❌ Error getting user reviews:', error);
    return {
      success: false,
      reviews: []
    };
  }
};

/**
 * Sync user's reviewed meals from existing ratings (for legacy data)
 * @param {string} uid - User ID
 * @returns {Array} Array of mealIds
 */
export const syncUserReviewedMeals = async (uid) => {
  try {
    console.log('🔄 Syncing reviewed meals for user:', uid);
    
    // We need to check common meal IDs - this is a workaround since we can't query subcollections
    // In production, you'd use a Cloud Function to do this properly
    // For now, we'll check against the bookmarks and any known meal IDs
    
    const reviewedMeals = [];
    
    // Get user's bookmarks to check for ratings there
    const bookmarksRef = collection(db, 'users', uid, 'bookmarks');
    const bookmarksSnap = await getDocs(bookmarksRef);
    
    const mealIdsToCheck = [];
    bookmarksSnap.forEach((doc) => {
      mealIdsToCheck.push(doc.id);
    });
    
    // Also add some common meal IDs from theMealDB (first 100)
    for (let i = 52764; i <= 52864; i++) {
      mealIdsToCheck.push(i.toString());
    }
    
    // Check each potential mealId for user's rating
    for (const mealId of mealIdsToCheck) {
      try {
        const userRatingRef = doc(db, 'ratings', mealId, 'userRatings', uid);
        const ratingSnap = await getDoc(userRatingRef);
        
        if (ratingSnap.exists()) {
          reviewedMeals.push(mealId);
          console.log('🔄 Found existing rating for meal:', mealId);
        }
      } catch (err) {
        // Ignore errors for individual meal checks
      }
    }
    
    // If we found any, save them to user profile
    if (reviewedMeals.length > 0) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        reviewedMeals: reviewedMeals
      });
      console.log('🔄 Synced', reviewedMeals.length, 'reviewed meals to user profile');
    }
    
    return reviewedMeals;
  } catch (error) {
    console.error('❌ Error syncing reviewed meals:', error);
    return [];
  }
};

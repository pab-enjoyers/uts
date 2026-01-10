// ========================================
// 📝 ARTIKEL SERVICE
// Firebase CRUD untuk artikel user
// ========================================

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

const ARTIKEL_COLLECTION = 'articles';

/**
 * Upload artikel thumbnail ke Firebase Storage
 * @param {string} userId - User ID penulis
 * @param {string} imageUri - Local image URI
 * @returns {Object} { success, thumbnailURL }
 */
export const uploadArtikelThumbnail = async (userId, imageUri) => {
  try {
    if (!imageUri || !imageUri.startsWith('file://')) {
      console.log('📷 No valid image URI to upload');
      return { success: true, thumbnailURL: '' };
    }

    console.log('📷 Uploading thumbnail to Firebase Storage...');
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Create reference to storage
    const filename = `artikel_${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `artikel_thumbnails/${filename}`);
    
    // Upload file
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log('📷 Thumbnail uploaded successfully:', downloadURL);
    
    return {
      success: true,
      thumbnailURL: downloadURL
    };
  } catch (error) {
    console.error('📷 Error uploading thumbnail:', error);
    return {
      success: false,
      thumbnailURL: '',
      error: error.message
    };
  }
};

/**
 * Create artikel baru
 * @param {string} userId - User ID penulis
 * @param {object} artikelData - Data artikel {title, content, category, thumbnail}
 */
export const createArtikel = async (userId, artikelData) => {
  try {
    const docRef = await addDoc(collection(db, ARTIKEL_COLLECTION), {
      userId,
      title: artikelData.title,
      content: artikelData.content,
      category: artikelData.category || 'Umum',
      thumbnail: artikelData.thumbnail || '',
      views: 0,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      articleId: docRef.id,
    };
  } catch (error) {
    console.error('Error creating artikel:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get artikel by ID
 * @param {string} articleId 
 */
export const getArtikelById = async (articleId) => {
  try {
    const docRef = doc(db, ARTIKEL_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        artikel: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      };
    } else {
      return {
        success: false,
        error: 'Artikel tidak ditemukan',
      };
    }
  } catch (error) {
    console.error('Error getting artikel:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all artikel by user ID
 * @param {string} userId 
 */
export const getArtikelByUser = async (userId) => {
  try {
    // Query tanpa orderBy untuk menghindari composite index requirement
    const q = query(
      collection(db, ARTIKEL_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort di client-side berdasarkan createdAt descending
    articles.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA; // Descending (terbaru dulu)
    });

    return {
      success: true,
      articles,
    };
  } catch (error) {
    console.error('Error getting user articles:', error);
    return {
      success: false,
      error: error.message,
      articles: [],
    };
  }
};

/**
 * Get all artikel (public)
 */
export const getAllArtikel = async () => {
  try {
    // Get all articles tanpa orderBy untuk menghindari index requirement
    const querySnapshot = await getDocs(collection(db, ARTIKEL_COLLECTION));
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort di client-side berdasarkan createdAt descending
    articles.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA; // Descending (terbaru dulu)
    });

    return {
      success: true,
      articles,
    };
  } catch (error) {
    console.error('Error getting all articles:', error);
    return {
      success: false,
      error: error.message,
      articles: [],
    };
  }
};

/**
 * Update artikel
 * @param {string} articleId 
 * @param {object} updates 
 */
export const updateArtikel = async (articleId, updates) => {
  try {
    const docRef = doc(db, ARTIKEL_COLLECTION, articleId);
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating artikel:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete artikel
 * @param {string} articleId 
 */
export const deleteArtikel = async (articleId) => {
  try {
    const docRef = doc(db, ARTIKEL_COLLECTION, articleId);
    await deleteDoc(docRef);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting artikel:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Increment views count
 * @param {string} articleId 
 */
export const incrementViews = async (articleId) => {
  try {
    const docRef = doc(db, ARTIKEL_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false };
  }
};

/**
 * Toggle like on article
 * @param {string} articleId 
 * @param {boolean} isLiked - current like status
 */
export const toggleLikeArtikel = async (articleId, isLiked) => {
  try {
    const docRef = doc(db, ARTIKEL_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentLikes = docSnap.data().likes || 0;
      const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
      
      await updateDoc(docRef, {
        likes: newLikes,
      });
      
      return {
        success: true,
        likes: newLikes,
      };
    } else {
      return {
        success: false,
        error: 'Artikel tidak ditemukan',
      };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

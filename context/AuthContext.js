// ========================================
// 🔐 AUTHENTICATION CONTEXT
// Global state management untuk authentication
// ========================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { 
  saveToken, 
  saveUserData, 
  getUserData, 
  clearAllAuthData,
  setLoginStatus,
  isLoggedIn as checkLoginStatus
} from '../utils/storage';
import { handleFirebaseError } from '../utils/errorHandler';
import { createUserProfile, getUserProfile } from '../services/userService';

// Create Context
const AuthContext = createContext({});

// Custom Hook untuk menggunakan Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Check auth state saat app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in - Load profile from Firestore
        try {
          const profileResult = await getUserProfile(firebaseUser.uid);
          if (profileResult.success && profileResult.data) {
            // Use Firestore data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...profileResult.data,
            });
          } else {
            // Fallback to basic data if profile not found
            const userData = await getUserData();
            setUser(userData || {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback
          const userData = await getUserData();
          setUser(userData || {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
        setIsAuthenticated(true);
      } else {
        // User is logged out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  /**
   * Register user baru
   * @param {string} email 
   * @param {string} password 
   * @param {string} nama 
   */
  const register = async (email, password, nama) => {
    try {
      setLoading(true);
      
      // Create user di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get token
      const token = await firebaseUser.getIdToken();
      
      // User data untuk disimpan
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nama: nama,
        createdAt: new Date().toISOString(),
      };
      
      // Simpan user profile ke Firestore
      await createUserProfile(firebaseUser.uid, userData);
      
      // Simpan ke AsyncStorage
      await saveToken(token);
      await saveUserData(userData);
      await setLoginStatus(true);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        user: userData 
      };
      
    } catch (error) {
      const errorInfo = handleFirebaseError(error);
      return { 
        success: false, 
        error: errorInfo.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Sign in dengan Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get token
      const token = await firebaseUser.getIdToken();
      
      // Get user profile dari Firestore
      const userProfile = await getUserProfile(firebaseUser.uid);
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nama: userProfile?.data?.nama || userProfile?.nama || 'User',
        ...(userProfile?.data || userProfile),
      };
      
      // Simpan ke AsyncStorage
      await saveToken(token);
      await saveUserData(userData);
      await setLoginStatus(true);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        user: userData 
      };
      
    } catch (error) {
      const errorInfo = handleFirebaseError(error);
      return { 
        success: false, 
        error: errorInfo.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Sign out dari Firebase
      await signOut(auth);
      
      // Clear AsyncStorage
      await clearAllAuthData();
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
      
    } catch (error) {
      const errorInfo = handleFirebaseError(error);
      return { 
        success: false, 
        error: errorInfo.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check apakah user sudah login (dari AsyncStorage)
   */
  const checkAuthStatus = async () => {
    try {
      const loggedIn = await checkLoginStatus();
      const userData = await getUserData();
      
      if (loggedIn && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  /**
   * Update password user
   * @param {string} currentPassword - Password saat ini
   * @param {string} newPassword - Password baru
   */
  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      if (!auth.currentUser) {
        return {
          success: false,
          error: 'User tidak ditemukan'
        };
      }

      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      
      return {
        success: true,
        message: 'Password berhasil diubah'
      };
    } catch (error) {
      const errorInfo = handleFirebaseError(error);
      console.error('Error updating password:', errorInfo);
      return {
        success: false,
        error: errorInfo.message
      };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    unreadNotifications,
    setUnreadNotifications,
    register,
    login,
    logout,
    checkAuthStatus,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

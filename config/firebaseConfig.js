// ========================================
// 🔥 FIREBASE CONFIGURATION
// Setup Firebase untuk Authentication dan Firestore
// ========================================

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Ganti dengan Firebase credentials dari Firebase Console
// Cara mendapatkan config:
// 1. Buka https://console.firebase.google.com/
// 2. Pilih project atau buat project baru
// 3. Klik Project Settings (gear icon)
// 4. Scroll ke bawah, pilih "Web app" atau add app
// 5. Copy firebaseConfig object

const firebaseConfig = {
  apiKey: "AIzaSyB2UDGq1gS8uzULVs9Ve1K4uVIo0QwHdDk",
  authDomain: "gudang-resep-52474.firebaseapp.com",
  projectId: "gudang-resep-52474",
  storageBucket: "gudang-resep-52474.firebasestorage.app",
  messagingSenderId: "379427096506",
  appId: "1:379427096506:web:3e65218750611ef7b07f83",
  measurementId: "G-5SWZ2VB63N"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with AsyncStorage persistence for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Initialize Firestore
  db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  // Handle case where app is already initialized
  if (error.code === 'app/duplicate-app') {
    console.log('⚠️ Firebase app already initialized');
    const { getApp } = require('firebase/app');
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

export { auth, db };
export default app;

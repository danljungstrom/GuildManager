import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

// Initialize Firebase - works on both client and server
function initializeFirebase() {
  if (app && db) {
    return { app, db };
  }

  // Debug: log what we have
  if (typeof window !== 'undefined') {
    console.log('Firebase config check:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      apiKeyPrefix: firebaseConfig.apiKey?.substring(0, 10),
    });
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase config missing - apiKey or projectId not set');
    return { app: undefined, db: undefined };
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  
  return { app, db };
}

// Initialize immediately
const initialized = initializeFirebase();
app = initialized.app;
db = initialized.db;

export { app, db };

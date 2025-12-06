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

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      '⚠️ Firebase configuration missing.\n' +
      'Please ensure all required Firebase environment variables are set:\n' +
      '- NEXT_PUBLIC_FIREBASE_API_KEY\n' +
      '- NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' +
      '- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' +
      '- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n' +
      '- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' +
      '- NEXT_PUBLIC_FIREBASE_APP_ID\n\n' +
      'Check your environment variables in Vercel or your hosting platform.'
    );
    return { app: undefined, db: undefined };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);

    if (process.env.NODE_ENV === 'development') {
      console.info('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    return { app: undefined, db: undefined };
  }

  return { app, db };
}

// Initialize immediately
const initialized = initializeFirebase();
app = initialized.app;
db = initialized.db;

export { app, db };

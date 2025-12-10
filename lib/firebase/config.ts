import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Check if we should use the Firebase Emulator
const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
const EMULATOR_HOST = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost';
const EMULATOR_PORT = parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || '8080', 10);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let emulatorConnected = false;

// Initialize Firebase - works on both client and server
function initializeFirebase() {
  if (app && db) {
    return { app, db };
  }

  // When using emulator, we don't need real credentials
  if (!USE_EMULATOR && (!firebaseConfig.apiKey || !firebaseConfig.projectId || firebaseConfig.apiKey === 'demo-api-key')) {
    console.warn(
      '⚠️ Firebase configuration missing.\n' +
      'Please ensure all required Firebase environment variables are set:\n' +
      '- NEXT_PUBLIC_FIREBASE_API_KEY\n' +
      '- NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' +
      '- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' +
      '- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' +
      '- NEXT_PUBLIC_FIREBASE_APP_ID\n\n' +
      'Or set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true to use local emulator.'
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

    // Connect to Firestore Emulator if enabled
    if (USE_EMULATOR && !emulatorConnected) {
      connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT);
      emulatorConnected = true;
      console.info(`🔥 Connected to Firestore Emulator at ${EMULATOR_HOST}:${EMULATOR_PORT}`);
    } else if (process.env.NODE_ENV === 'development' && !USE_EMULATOR) {
      console.info('✅ Firebase initialized (using production Firestore)');
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

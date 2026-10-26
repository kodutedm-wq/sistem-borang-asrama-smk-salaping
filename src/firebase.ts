import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  query
} from 'firebase/firestore';
import { PermohonanAsrama, StatusPermohonan } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Effective Firebase configuration (supports Netlify environment variables or committed JSON config)
export const effectiveFirebaseConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfig.projectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || firebaseConfig.appId,
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || firebaseConfig.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfig.authDomain,
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || firebaseConfig.firestoreDatabaseId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfig.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfig.messagingSenderId,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(effectiveFirebaseConfig) : getApp();

// Initialize Cloud Firestore using provisioned database ID
export const db = effectiveFirebaseConfig.firestoreDatabaseId && effectiveFirebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, effectiveFirebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const COLLECTION_NAME = 'permohonan';

/**
 * Real-time subscription to student boarding applications.
 * Handles quota exhaustion (resource-exhausted) gracefully without breaking the app.
 */
export function subscribeToPermohonan(
  onData: (data: PermohonanAsrama[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      q,
      (snapshot) => {
        const results: PermohonanAsrama[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as PermohonanAsrama);
        });
        
        // Sort newest first by application date or ID
        results.sort((a, b) => (b.tarikhPermohonan || '').localeCompare(a.tarikhPermohonan || '') || b.id.localeCompare(a.id));
        onData(results);
      },
      (error) => {
        const isQuotaExceeded = error?.message?.includes('Quota limit exceeded') || (error as any)?.code === 'resource-exhausted';
        if (isQuotaExceeded) {
          console.warn("Firestore daily free read quota reached. Running in offline/local persistent mode.");
        } else {
          console.warn("Firestore onSnapshot notice:", error?.message || error);
        }
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn("Firestore subscription initialized in local fallback mode:", err);
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

/**
 * Save new or updated application to Cloud Firestore with local fallback
 */
export async function savePermohonanToCloud(data: PermohonanAsrama): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, data.id);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (err: any) {
    console.warn("Firestore write notice (saved in local device storage):", err?.message || err);
    return false;
  }
}

/**
 * Update application status with local fallback
 */
export async function updatePermohonanStatusInCloud(
  id: string, 
  status: StatusPermohonan,
  extra: Partial<PermohonanAsrama> = {}
): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      statusKelulusan: status,
      ...extra
    });
    return true;
  } catch (err: any) {
    console.warn("Firestore update notice (updated locally):", err?.message || err);
    return false;
  }
}

/**
 * Delete application with local fallback
 */
export async function deletePermohonanFromCloud(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn("Firestore delete notice (removed locally):", err?.message || err);
    return false;
  }
}

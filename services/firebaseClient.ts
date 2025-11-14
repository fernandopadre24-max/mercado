import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export let app: FirebaseApp | null = null;
export let db: Firestore | null = null;

export const initFirebase = (config: object): void => {
    if (getApps().length === 0) {
        try {
            app = initializeApp(config);
            db = getFirestore(app);
        } catch (error: any) {
            console.error("Firebase initialization failed:", error);
            throw new Error(`Invalid Firebase config: ${error.message}`);
        }
    } else {
        app = getApps()[0];
        db = getFirestore(app);
    }
};

import * as admin from "firebase-admin";

// Fungsi untuk inisialisasi
const initFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  // Pastikan variabel ada sebelum dipakai
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("❌ File .env.local belum terbaca atau isinya kosong!");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
};

// Inisialisasi app
const app = initFirebase();

// Export db
export const db = admin.firestore(app);

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZIDCe24PQCzT43f89IfSJRXstcYXubgE",
  authDomain: "presensi-bbba6.firebaseapp.com",
  projectId: "presensi-bbba6",
  storageBucket: "presensi-bbba6.firebasestorage.app",
  messagingSenderId: "995459800827",
  appId: "1:995459800827:web:e7e5ad8255a12cb4cd5a5e",
  measurementId: "G-21JFPZFK07",
  databaseURL:
    "https://presensi-bbba6-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

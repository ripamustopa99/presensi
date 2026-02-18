// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  update,
  remove,
} from "firebase/database";

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app);

console.log("✅ Firebase Connected");

/* ==============================
   🟢 CREATE DATA
============================== */
export async function createUser() {
  try {
    const usersRef = ref(database, "users");
    const newUserRef = push(usersRef);

    await set(newUserRef, {
      nama: "Budi",
      email: "budi@email.com",
      createdAt: Date.now(),
    });

    console.log("🟢 Data berhasil ditambahkan");
    return newUserRef.key;
  } catch (error) {
    console.error("❌ Error create:", error);
  }
}

/* ==============================
   🔵 READ DATA
============================== */
export async function readUsers() {
  try {
    const snapshot = await get(ref(database, "users"));

    if (snapshot.exists()) {
      console.log("🔵 Data Users:");
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("⚠️ Tidak ada data");
      return null;
    }
  } catch (error) {
    console.error("❌ Error read:", error);
  }
}

/* ==============================
   🔥 TEST FUNCTION (optional)
============================== */
export async function testCRUD() {
  const id = await createUser();
  await readUsers();
}

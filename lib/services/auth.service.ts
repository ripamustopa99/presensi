import fs from "fs/promises";
import path from "path";

// Tentukan lokasi file database JSON
const filePath = path.join(process.cwd(), "lib/db-local.json");
async function readDB() {
  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    // Jika file belum ada, kembalikan struktur default agar tidak error
    return { users: [], students: [], classes: [], sessions: [] };
  }
}

export async function findUserByAccount(account: string) {
  const db = await readDB();

  // Mencari di dalam array 'users'
  const user = db.users.find(
    (u: any) => u.email === account || u.username === account,
  );
  return user || null;
}

/**
 * Fungsi untuk mengambil data user berdasarkan ID (untuk proteksi session)
 */
export async function getUserById(id: string) {
  const db = await readDB();
  const user = db.users.find((u: any) => u.id === id);
  return user || null;
}
export async function getAllStudents() {
  const db = await readDB();
  const students = db.students;
  return students;
}
/**
 * BONUS: Fungsi untuk menambah user baru (Sign Up)
 * Jika suatu saat kamu butuh fitur pendaftaran admin/guru.
 */
export async function createUserService(userData: any) {
  const db = await readDB();

  const newUser = {
    ...userData,
    id: Date.now().toString(), // ID sementara pakai timestamp
  };

  db.users.push(newUser);

  await fs.writeFile(filePath, JSON.stringify(db, null, 2));
  return newUser;
}

// import { db } from "@/lib/firebase-admin";

// export async function findUserByAccount(account: string) {
//   try {
//     const usersRef = db.collection("users");
//     // Mencari berdasarkan username_email atau email
//     const snapshot = await usersRef.where("username_email", "==", account).limit(1).get();

//     if (snapshot.empty) return null;

//     const doc = snapshot.docs[0];
//     return { id: doc.id, ...doc.data() };
//   } catch (error) {
//     console.error("Firebase Auth Error:", error);
//     return null;
//   }
// }

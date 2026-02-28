import { db } from "@/lib/firebase-admin";

const COLLECTION_USERS = "users";
const COLLECTION_STUDENTS = "students";

/**
 * Fungsi Internal untuk mengecek dan membuat Admin Default jika DB kosong
 */
async function ensureAdminExists() {
  const userRef = db.collection(COLLECTION_USERS);
  const snapshot = await userRef.limit(1).get();

  if (snapshot.empty) {
    console.log("🌱 Database kosong, membuat admin default...");
    const defaultAdmin = {
      name: "Super Admin",
      username: "admin",
      email: "admin@presensi.com",
      password: "admin123", // Segera ganti setelah login!
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    // Kita pakai ID dokumen manual agar tidak duplikat
    await userRef.doc("default-admin").set(defaultAdmin);
  }
}

/**
 * Mencari user berdasarkan Email atau Username
 */
export async function findUserByAccount(account: string) {
  try {
    // 1. Jalankan pengecekan admin default setiap kali login dipanggil
    await ensureAdminExists();

    // 2. Cari berdasarkan Email
    const emailSnap = await db
      .collection(COLLECTION_USERS)
      .where("email", "==", account)
      .limit(1)
      .get();

    if (!emailSnap.empty) {
      const doc = emailSnap.docs[0];
      return { _id: doc.id, ...doc.data() };
    }

    // 3. Cari berdasarkan Username
    const userSnap = await db
      .collection(COLLECTION_USERS)
      .where("username", "==", account)
      .limit(1)
      .get();

    if (!userSnap.empty) {
      const doc = userSnap.docs[0];
      return { _id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

export async function getAllStudents() {
  try {
    const snapshot = await db.collection(COLLECTION_STUDENTS).get();
    return snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
}

/**
 * Menambah user baru (Sign Up)
 */
export async function createUserService(userData: any) {
  try {
    // Di Firebase, kita biarkan Firebase membuat ID unik otomatis (docRef.id)
    const docRef = await db.collection(COLLECTION_USERS).add({
      ...userData,
      createdAt: new Date().toISOString(),
    });

    return { _id: docRef.id, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Gagal membuat user baru");
  }
}

// import fs from "fs/promises";
// import path from "path";

// // Tentukan lokasi file database JSON
// const filePath = path.join(process.cwd(), "lib/db-local.json");
// async function readDB() {
//   try {
//     const jsonData = await fs.readFile(filePath, "utf8");
//     return JSON.parse(jsonData);
//   } catch (error) {
//     // Jika file belum ada, kembalikan struktur default agar tidak error
//     return { users: [], students: [], classes: [], sessions: [] };
//   }
// }

// export async function findUserByAccount(account: string) {
//   const db = await readDB();

//   // Mencari di dalam array 'users'
//   const user = db.users.find(
//     (u: any) => u.email === account || u.username === account,
//   );
//   return user || null;
// }

// /**
//  * Fungsi untuk mengambil data user berdasarkan ID (untuk proteksi session)
//  */
// export async function getUserById(id: string) {
//   const db = await readDB();
//   const user = db.users.find((u: any) => u.id === id);
//   return user || null;
// }
// export async function getAllStudents() {
//   const db = await readDB();
//   const students = db.students;
//   return students;
// }
// /**
//  * BONUS: Fungsi untuk menambah user baru (Sign Up)
//  * Jika suatu saat kamu butuh fitur pendaftaran admin/guru.
//  */
// export async function createUserService(userData: any) {
//   const db = await readDB();

//   const newUser = {
//     ...userData,
//     id: Date.now().toString(), // ID sementara pakai timestamp
//   };

//   db.users.push(newUser);

//   await fs.writeFile(filePath, JSON.stringify(db, null, 2));
//   return newUser;
// }

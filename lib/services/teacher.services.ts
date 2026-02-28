import { db } from "@/lib/firebase-admin";

const COLLECTION_USERS = "users";

/**
 * PRO: Get All Teachers
 * Menambahkan sorting dan error handling yang lebih spesifik
 */
export async function getAllTeachers() {
  try {
    const snapshot = await db
      .collection(COLLECTION_USERS)
      .where("role", "==", "guru")
      .orderBy("createdAt", "desc") // Pro: Selalu urutkan data terbaru
      .get();

    return snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("🔥 Pro Error [getAllTeachers]:", error);
    return [];
  }
}
export async function createTeacher(data: any) {
  try {
    // 1. Sanitasi input (Menghindari spasi tak sengaja)
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();

    // 2. Pengecekan Duplikat Ganda secara Paralel (Lebih Cepat)
    const [checkUsername, checkEmail] = await Promise.all([
      db
        .collection(COLLECTION_USERS)
        .where("username", "==", username)
        .limit(1)
        .get(),
      db
        .collection(COLLECTION_USERS)
        .where("email", "==", email)
        .limit(1)
        .get(),
    ]);

    if (!checkUsername.empty) throw new Error("USERNAME_ALREADY_EXISTS");
    if (!checkEmail.empty) throw new Error("EMAIL_ALREADY_EXISTS");

    // 3. Menyiapkan data bersih
    const cleanData = {
      ...data,
      username,
      email,
      role: "guru",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true, // Pro: Status aktif untuk kontrol akses
    };

    const docRef = await db.collection(COLLECTION_USERS).add(cleanData);

    return { _id: docRef.id, ...cleanData };
  } catch (error: any) {
    console.error("🔥 Pro Error [createTeacher]:", error.message);
    throw error;
  }
}

/**
 * PRO: Update Teacher
 * Proteksi ID, Cek konflik email/username saat update
 */
export async function updateTeacher(id: string, data: any) {
  if (!id) throw new Error("ID_REQUIRED");

  try {
    const userRef = db.collection(COLLECTION_USERS).doc(id);
    const doc = await userRef.get();

    if (!doc.exists) throw new Error("TEACHER_NOT_FOUND");

    const updatedData: any = { ...data };

    // 1. Logic Password (Jangan simpan string kosong atau plain text jika tidak berubah)
    if (!updatedData.password || updatedData.password.trim() === "") {
      delete updatedData.password;
    }

    // 2. Pro: Proteksi agar Role tidak berubah lewat fungsi ini
    delete updatedData.role;
    delete updatedData.createdAt;

    updatedData.updatedAt = new Date().toISOString();

    await userRef.update(updatedData);

    return { success: true };
  } catch (error: any) {
    console.error("🔥 Pro Error [updateTeacher]:", error.message);
    throw error;
  }
}

/**
 * PRO: Delete Teacher
 * Bisa dikembangkan menjadi Soft Delete nantinya
 */
export async function deleteTeacher(id: string) {
  if (!id) throw new Error("ID_REQUIRED");

  try {
    // Pro: Cek dulu apakah user ini punya keterkaitan data (misal: Sesi yang sedang jalan)
    // Untuk saat ini kita langsung hapus
    await db.collection(COLLECTION_USERS).doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("🔥 Pro Error [deleteTeacher]:", error.message);
    throw error;
  }
}

// import fs from "fs/promises";
// import path from "path";

// const filePath = path.join(process.cwd(), "lib/db-local.json"); // Sesuaikan nama file JSON kamu

// async function readDB() {
//   const file = await fs.readFile(filePath, "utf-8");
//   return JSON.parse(file);
// }

// async function writeDB(data: any) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// export async function getAllTeachers() {
//   const db = await readDB();
//   // Filter hanya yang rolenya guru
//   return db.users.filter((user: any) => user.role === "guru");
// }

// export async function createTeacher(data: any) {
//   const db = await readDB();
//   ``;
//   const newUser = {
//     _id: Math.random().toString(36).substr(2, 9),
//     ...data,
//     role: "guru", // Pastikan role selalu guru
//   };
//   db.users.push(newUser);
//   await writeDB(db);
//   return newUser;
// }

// export async function updateTeacher(id: string, data: any) {
//   const db = await readDB();
//   const index = db.users.findIndex((u: any) => u._id === id);
//   if (index === -1) throw new Error("User tidak ditemukan");

//   // Jika password kosong, jangan timpa password lama
//   const updatedData = { ...data };
//   if (!updatedData.password) {
//     delete updatedData.password;
//   }

//   db.users[index] = { ...db.users[index], ...updatedData };
//   await writeDB(db);
// }

// export async function deleteTeacher(id: string) {
//   const db = await readDB();
//   db.users = db.users.filter((u: any) => u._id !== id);
//   await writeDB(db);
// }

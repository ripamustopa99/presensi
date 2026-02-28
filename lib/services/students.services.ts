import { db } from "@/lib/firebase-admin";

const COLLECTION_NAME = "students";

/**
 * PRO: Get All Students
 * Menggunakan sorting agar data tidak acak-acakan saat ditampilkan
 */
export async function getAllStudents() {
  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy("name", "asc") // Pro: Urutkan nama sesuai abjad
      .get();

    return snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("🔥 Pro Error [getAllStudents]:", error);
    return [];
  }
}

/**
 * PRO: Create Student
 * Proteksi Duplikat NIS/Email + Sanitasi Nama
 */
export async function createStudent(data: any) {
  try {
    // 1. Sanitasi Data
    const nis = data.nis?.trim();
    const name = data.name?.toUpperCase().trim(); // Pro: Nama santri biasanya standar huruf kapital

    // 2. Cek Duplikat NIS (Jika ada field NIS)
    if (nis) {
      const existingNis = await db
        .collection(COLLECTION_NAME)
        .where("nis", "==", nis)
        .limit(1)
        .get();

      if (!existingNis.empty) throw new Error("NIS_ALREADY_EXISTS");
    }

    // 3. Siapkan Data Pro
    const cleanData = {
      ...data,
      name,
      nis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "aktif", // Pro: Tambahkan status default
    };

    const docRef = await db.collection(COLLECTION_NAME).add(cleanData);

    return {
      _id: docRef.id,
      ...cleanData,
    };
  } catch (error: any) {
    console.error("🔥 Pro Error [createStudent]:", error.message);
    throw error;
  }
}

/**
 * PRO: Update Student
 */
export async function updateStudent(id: string, data: any) {
  if (!id) throw new Error("ID_REQUIRED");

  try {
    const studentRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await studentRef.get();

    if (!doc.exists) throw new Error("STUDENT_NOT_FOUND");

    // Pro: Hindari menimpa ID atau tanggal buat
    const updatedData = {
      ...data,
      name: data.name?.toUpperCase().trim(),
      updatedAt: new Date().toISOString(),
    };

    delete updatedData._id;
    delete updatedData.createdAt;

    await studentRef.update(updatedData);

    return { _id: id, ...updatedData };
  } catch (error: any) {
    console.error("🔥 Pro Error [updateStudent]:", error.message);
    throw error;
  }
}

/**
 * PRO: Delete Student
 */
export async function deleteStudent(id: string) {
  if (!id) throw new Error("ID_REQUIRED");

  try {
    // Pro: Bisa tambahkan pengecekan apakah santri punya riwayat absen
    // Jika punya, sebaiknya dilarang hapus (harus hapus absen dulu)
    await db.collection(COLLECTION_NAME).doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("🔥 Pro Error [deleteStudent]:", error.message);
    throw error;
  }
}
// import fs from "fs/promises";
// import path from "path";

// const filePath = path.join(process.cwd(), "lib/db-local.json"); // Pastikan path ini benar

// // Helper untuk membaca database utuh
// async function readDB() {
//   try {
//     const file = await fs.readFile(filePath, "utf-8");
//     return JSON.parse(file);
//   } catch (error) {
//     // Jika file tidak ada, kembalikan struktur default
//     return { users: [], students: [], classes: [], sessions: [] };
//   }
// }

// // Helper untuk menulis database utuh
// async function writeDB(data: any) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// export async function getAllStudents() {
//   const db = await readDB();
//   return db.students || [];
// }

// export async function createStudent(data: any) {
//   const db = await readDB();

//   const newStudent = {
//     _id: Date.now().toString(), // Gunakan _id agar konsisten dengan schema kamu
//     ...data,
//     createdAt: new Date().toISOString(),
//   };

//   db.students.push(newStudent);
//   await writeDB(db);
//   return newStudent;
// }

// export async function updateStudent(id: string, data: any) {
//   const db = await readDB();
//   const index = db.students.findIndex((s: any) => s._id === id || s.id === id);

//   if (index === -1) throw new Error("Santri tidak ditemukan");

//   db.students[index] = {
//     ...db.students[index],
//     ...data,
//     _id: id, // Pastikan ID tidak berubah
//     updatedAt: new Date().toISOString(),
//   };

//   await writeDB(db);
//   return db.students[index];
// }

// export async function deleteStudent(id: string) {
//   const db = await readDB();
//   db.students = db.students.filter((s: any) => s._id !== id && s.id !== id);
//   await writeDB(db);
// }

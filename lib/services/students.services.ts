import { db } from "@/lib/firebase-admin";

const COLLECTION_NAME = "students";

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

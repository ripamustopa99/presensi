import { db } from "@/lib/firebase-admin";
import { ClassInput } from "../schemas/class.schema";

const COLLECTION_NAME = "classes";

/**
 * PRO: Get All Classes
 * Menambahkan pengurutan berdasarkan nama agar rapi di dropdown/tabel
 */
export async function getAllClasses() {
  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy("name", "asc") // Pro: Urutkan nama kelas A-Z
      .get();

    return snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    })) as any[];
  } catch (error) {
    console.error("🔥 Pro Error [getAllClasses]:", error);
    return [];
  }
}

/**
 * PRO: Create Class
 * Proteksi nama kelas duplikat (Case-Insensitive)
 */
export async function createClass(data: ClassInput) {
  try {
    // 1. Sanitasi Nama Kelas (Contoh: "Kelas A " -> "KELAS A")
    const className = data.class_name.trim().toUpperCase();
    // const className = data.name.trim().toUpperCase();

    // 2. Cek apakah nama kelas sudah ada
    const existingClass = await db
      .collection(COLLECTION_NAME)
      .where("name", "==", className)
      .limit(1)
      .get();

    if (!existingClass.empty) {
      throw new Error("CLASS_NAME_ALREADY_EXISTS");
    }

    // 3. Simpan data dengan field tambahan untuk audit
    const cleanData = {
      ...data,
      name: className,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentCount: 0, // Pro: Inisialisasi hitungan murid jika diperlukan
    };

    const docRef = await db.collection(COLLECTION_NAME).add(cleanData);

    return {
      _id: docRef.id,
      ...cleanData,
    };
  } catch (error: any) {
    console.error("🔥 Pro Error [createClass]:", error.message);
    throw error;
  }
}

/**
 * PRO: Update Class
 * Proteksi agar tidak merubah nama menjadi nama kelas lain yang sudah ada
 */
export async function updateClass(_id: string, data: ClassInput) {
  if (!_id) throw new Error("CLASS_ID_REQUIRED");

  try {
    const classRef = db.collection(COLLECTION_NAME).doc(_id);
    const doc = await classRef.get();

    if (!doc.exists) throw new Error("CLASS_NOT_FOUND");

    // const newName = data.name.trim().toUpperCase();
    const newName = data.class_name.trim().toUpperCase();

    // Jika nama berubah, cek apakah nama baru sudah dipakai kelas lain
    if (newName !== doc.data()?.name) {
      const duplicateCheck = await db
        .collection(COLLECTION_NAME)
        .where("name", "==", newName)
        .limit(1)
        .get();

      if (!duplicateCheck.empty) throw new Error("CLASS_NAME_ALREADY_EXISTS");
    }

    const updatedData = {
      ...data,
      name: newName,
      updatedAt: new Date().toISOString(),
    };

    // Proteksi agar _id dan createdAt tidak tertimpa
    delete (updatedData as any)._id;
    delete (updatedData as any).createdAt;

    await classRef.update(updatedData);

    return { success: true };
  } catch (error: any) {
    console.error("🔥 Pro Error [updateClass]:", error.message);
    throw error;
  }
}

/**
 * PRO: Delete Class
 */
export async function deleteClass(_id: string) {
  if (!_id) throw new Error("CLASS_ID_REQUIRED");

  try {
    // Pro: Di masa depan, tambahkan cek apakah masih ada murid di kelas ini
    // Jika masih ada murid, cegah penghapusan kelas.
    await db.collection(COLLECTION_NAME).doc(_id).delete();
    return { success: true };
  } catch (error) {
    console.error("🔥 Pro Error [deleteClass]:", error);
    throw error;
  }
}

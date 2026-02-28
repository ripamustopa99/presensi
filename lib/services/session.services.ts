import { db } from "@/lib/firebase-admin";

const COLLECTION_NAME = "sessions";

/**
 * PRO: Get All Sessions
 * Mengambil data dengan limit untuk menjaga performa saat data sudah ribuan
 */
export async function getAllSessions(limit: number = 100) {
  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("🔥 Pro Error [getAllSessions]:", error);
    return [];
  }
}

/**
 * PRO: Save Session
 * Mencegah duplikasi sesi aktif untuk kelas yang sama di tanggal yang sama
 */
export async function saveSession(data: any) {
  try {
    const { _id, ...payload } = data;

    // 1. Jika sesi baru, cek apakah sudah ada sesi "berlangsung" untuk kelas ini
    if (!_id) {
      const today = new Date().toISOString().split("T")[0];
      const existingActive = await db
        .collection(COLLECTION_NAME)
        .where("classId", "==", payload.classId)
        .where("status", "==", "berlangsung")
        .limit(1)
        .get();

      if (!existingActive.empty) {
        throw new Error("ACTIVE_SESSION_EXISTS");
      }
    }

    if (_id) {
      const sessionRef = db.collection(COLLECTION_NAME).doc(_id);
      await sessionRef.update({
        ...payload,
        updatedAt: new Date().toISOString(),
      });
      return { success: true, _id };
    } else {
      const docRef = await db.collection(COLLECTION_NAME).add({
        ...payload,
        createdAt: new Date().toISOString(),
        status: payload.status || "berlangsung",
      });
      return { success: true, _id: docRef.id };
    }
  } catch (error: any) {
    console.error("🔥 Pro Error [saveSession]:", error.message);
    throw error; // Lempar ke action untuk ditangani
  }
}

/**
 * PRO: Update Absen Data
 * Menggunakan atomicity untuk memastikan status berubah hanya jika data masuk
 */
export async function updateAbsenData(sessionId: string, absenData: any) {
  if (!sessionId) throw new Error("SESSION_ID_REQUIRED");

  try {
    const sessionRef = db.collection(COLLECTION_NAME).doc(sessionId);

    // Pro: Kita gunakan update untuk keamanan data
    await sessionRef.update({
      attendance_data: absenData,
      status: "selesai",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("🔥 Pro Error [updateAbsenData]:", error.message);
    throw error;
  }
}

/**
 * PRO: Delete Session
 */
export async function deleteSession(_id: string) {
  try {
    await db.collection(COLLECTION_NAME).doc(_id).delete();
    return { success: true };
  } catch (error) {
    console.error("🔥 Pro Error [deleteSession]:", error);
    throw error;
  }
}

// /**
//  * Menghapus Sesi
//  */
// export async function deleteSession(_id: string) {
//   try {
//     await db.collection(COLLECTION_NAME).doc(_id).delete();
//     return { success: true };
//   } catch (error) {
//     console.error("Gagal delete session:", error);
//     return { success: false };
//   }
// }

// import fs from "fs/promises";
// import path from "path";

// const filePath = path.join(process.cwd(), "lib/db-local.json");

// async function readDB() {
//   const file = await fs.readFile(filePath, "utf-8");
//   return JSON.parse(file);
// }

// async function writeDB(data: any) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// export async function getAllSessions() {
//   const db = await readDB();
//   return db.sessions || [];
// }

// export async function saveSession(data: any) {
//   const db = await readDB();
//   if (data._id) {
//     const index = db.sessions.findIndex((s: any) => s._id === data._id);
//     if (index !== -1) db.sessions[index] = { ...db.sessions[index], ...data };
//   } else {
//     const newSession = { ...data, _id: Date.now().toString() };
//     db.sessions.push(newSession);
//   }
//   await writeDB(db);
//   return { success: true };
// }

// export async function updateAbsenData(sessionId: string, absenData: any) {
//   const db = await readDB();
//   const index = db.sessions.findIndex((s: any) => s._id === sessionId);
//   if (index !== -1) {
//     db.sessions[index].attendance_data = absenData;
//     db.sessions[index].status = "selesai";
//     await writeDB(db);
//     return { success: true };
//   }
//   return { success: false };
// }

// export async function deleteSession(_id: string) {
//   const db = await readDB();
//   db.sessions = db.sessions.filter((s: any) => s._id !== _id);
//   await writeDB(db);
//   return { success: true };
// }

import { db } from "@/lib/firebase-admin";

const COLLECTION_USERS = "users";

export const ProfileService = {
  /**
   * PRO: Get User By ID
   * Menggunakan return type yang jelas dan handling error spesifik
   */
  getUserById: async (id: string) => {
    if (!id) return null;
    try {
      const userDoc = await db.collection(COLLECTION_USERS).doc(id).get();

      if (!userDoc.exists) return null;

      const data = userDoc.data();
      // Pro: Jangan sertakan password saat mengambil profil (Security)
      if (data) delete data.password;

      return {
        _id: userDoc.id,
        ...data,
      };
    } catch (error) {
      console.error("🔥 Pro Error [getUserById]:", error);
      return null;
    }
  },

  /**
   * PRO: Update User Profile
   * Pengecekan konflik identitas (Email/Username) & Proteksi Role
   */
  updateUser: async (id: string, updateData: any) => {
    try {
      const userRef = db.collection(COLLECTION_USERS).doc(id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error("USER_NOT_FOUND");

      const currentData = userDoc.data();
      const newEmail = updateData.email?.trim().toLowerCase();
      const newUsername = updateData.username?.trim().toLowerCase();

      // 1. Cek duplikat Email jika email diganti
      if (newEmail && newEmail !== currentData?.email) {
        const emailCheck = await db
          .collection(COLLECTION_USERS)
          .where("email", "==", newEmail)
          .limit(1)
          .get();
        if (!emailCheck.empty) throw new Error("EMAIL_ALREADY_IN_USE");
      }

      // 2. Cek duplikat Username jika username diganti
      if (newUsername && newUsername !== currentData?.username) {
        const userCheck = await db
          .collection(COLLECTION_USERS)
          .where("username", "==", newUsername)
          .limit(1)
          .get();
        if (!userCheck.empty) throw new Error("USERNAME_ALREADY_IN_USE");
      }

      // 3. Mapping data bersih
      const formattedData: any = {
        name: updateData.name?.trim(),
        email: newEmail,
        username: newUsername,
        updatedAt: new Date().toISOString(),
      };

      if (updateData.avatar) formattedData.avatar = updateData.avatar;

      // 4. PROTEKSI: Jangan pernah izinkan update 'role' melalui fungsi profil
      delete formattedData.role;
      delete formattedData.createdAt;

      await userRef.update(formattedData);

      return {
        _id: id,
        ...currentData,
        ...formattedData,
      };
    } catch (error: any) {
      console.error("🔥 Pro Error [updateUser]:", error.message);
      throw error;
    }
  },
};

// import fs from "fs/promises";
// import path from "path";

// const dbPath = path.join(process.cwd(), "lib", "db-local.json");

// export const ProfileService = {
//   private_getAllData: async () => {
//     try {
//       const jsonData = await fs.readFile(dbPath, "utf-8");
//       return JSON.parse(jsonData);
//     } catch (error) {
//       return { users: [] };
//     }
//   },

//   getUserById: async (id: string) => {
//     const data = await ProfileService.private_getAllData();
//     // PERBAIKAN: Gunakan field "_id" sesuai data kamu
//     return data.users.find((u: any) => String(u._id) === String(id)) || null;
//   },

//   updateUser: async (id: string, updateData: any) => {
//     const data = await ProfileService.private_getAllData();
//     const userIndex = data.users.findIndex(
//       (u: any) => String(u._id) === String(id),
//     );

//     if (userIndex === -1) throw new Error("User tidak ditemukan");

//     // Mapping agar data UI (nama) masuk ke field DB (name)
//     const formattedData = {
//       ...data.users[userIndex],
//       name: updateData.name, // UI pakai 'nama', DB pakai 'name'
//       email: updateData.email,
//       username: updateData.username,
//       avatar: updateData.avatar, // jika ada field avatar
//     };

//     data.users[userIndex] = formattedData;

//     await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
//     return data.users[userIndex];
//   },
// };

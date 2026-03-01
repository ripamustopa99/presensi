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

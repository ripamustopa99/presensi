import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data/db.json"); // Sesuaikan nama file JSON kamu

async function readDB() {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}

async function writeDB(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getAllTeachers() {
  const db = await readDB();
  // Filter hanya yang rolenya guru
  return db.users.filter((user: any) => user.role === "guru");
}

export async function createTeacher(data: any) {
  const db = await readDB();
  ``;
  const newUser = {
    _id: Math.random().toString(36).substr(2, 9),
    ...data,
    role: "guru", // Pastikan role selalu guru
  };
  db.users.push(newUser);
  await writeDB(db);
  return newUser;
}

export async function updateTeacher(id: string, data: any) {
  const db = await readDB();
  const index = db.users.findIndex((u: any) => u._id === id);
  if (index === -1) throw new Error("User tidak ditemukan");

  // Jika password kosong, jangan timpa password lama
  const updatedData = { ...data };
  if (!updatedData.password) {
    delete updatedData.password;
  }

  db.users[index] = { ...db.users[index], ...updatedData };
  await writeDB(db);
}

export async function deleteTeacher(id: string) {
  const db = await readDB();
  db.users = db.users.filter((u: any) => u._id !== id);
  await writeDB(db);
}

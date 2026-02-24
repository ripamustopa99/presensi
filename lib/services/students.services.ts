// import fs from "fs/promises";
// import path from "path";

// const filePath = path.join(process.cwd(), "data/student.json");

// export async function getAllStudents() {
//   const file = await fs.readFile(filePath, "utf-8");
//   return JSON.parse(file);
// }

// export async function createStudent(data: any) {
//   const student = await getAllStudents();

//   student.push({
//     id: Date.now().toString(),
//     ...data,
//   });

//   await fs.writeFile(filePath, JSON.stringify(student, null, 2));
// }

// export async function deleteStudent(id: string) {
//   const student = await getAllStudents();
//   const filtered = student.filter((item: any) => item.id !== id);

//   await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
// }
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "../db-local.json");

// Helper untuk memastikan folder dan file ada
async function ensureFileExists() {
  try {
    await fs.access(filePath);
  } catch {
    // Jika folder data belum ada, buat folderners
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    // Buat file JSON kosong
    await fs.writeFile(filePath, JSON.stringify([], null, 2));
  }
}

export async function getAllStudents() {
  try {
    await ensureFileExists();
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading students:", error);
    return [];
  }
}

export async function createStudent(data: any) {
  const students = await getAllStudents();

  const newStudent = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  students.push(newStudent);
  await fs.writeFile(filePath, JSON.stringify(students, null, 2));
  return newStudent;
}

// FUNGSI UPDATE (Baru)
export async function updateStudent(id: string, data: any) {
  const students = await getAllStudents();
  const index = students.findIndex((item: any) => item.id === id);

  if (index === -1) throw new Error("Santri tidak ditemukan");

  // Gabungkan data lama dengan data baru, tapi ID tetap yang lama
  students[index] = {
    ...students[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(filePath, JSON.stringify(students, null, 2));
  return students[index];
}

export async function deleteStudent(id: string) {
  const students = await getAllStudents();
  const filtered = students.filter((item: any) => item.id !== id);

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
}

import { data } from "framer-motion/client";
import TeacherLayout from "./layout";
import { getAllTeachers } from "@/lib/services/teacher.services";
export default async function TeacherPage() {
  //   const data = await getAllTeachers();
  const data = [
    {
      _id: "1771457245683",
      role: "guru",
      email: "ad@pondok.id",
      username: "1010",
      password: "1100",
      name: "asdf",
    },
  ];
  //   console.log("Data Guru:", data);
  return <TeacherLayout data={data} />;
}

// // // import { Modal } from "@/components/ui/modal";
// // // import Input, { FormInput } from "@/components/ui/forminput";
// // // import { ChevronRight, Loader, Save, X } from "lucide-react";
// // // import { SelectInput } from "@/components/ui/forminput";
// // // const DAFTAR_KELAS = ["10-A", "10-B", "11-A", "11-B", "12-A"];
// // // import { StudentInput, studentSchema } from "@/lib/schemas/student.schema";
// // // import { useState } from "react";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import { addStudent } from "@/lib/actions/students.actions";
// // // import { useForm } from "react-hook-form";
// // // export function StudentModal({ isOpen, onClose, editingSantri }: any) {
// // //   const [error, setError] = useState<string | null>(null);

// // //   const {
// // //     register,

// // //     handleSubmit,
// // //     formState: { errors, isSubmitting },
// // //   } = useForm<StudentInput>({
// // //     resolver: zodResolver(studentSchema),
// // //     defaultValues: {
// // //       name: editingSantri?.name || "",
// // //       NIS: editingSantri?.NIS || "",
// // //       class: editingSantri?.class || "",
// // //     },
// // //   });

// // //   const onSubmit = async (formData: StudentInput) => {
// // //     setError(null);

// // //     try {
// // //       const result = await addStudent(formData);
// // //       if (result.success) {
// // //         // router.push("/dashboard");
// // //         onClose();
// // //       } else {
// // //         setError(result.message || "Terjadi kesalahan saat login");
// // //       }
// // //     } catch (err) {
// // //       setError("Gagal terhubung ke server");
// // //     }
// // //   };
// // //   return (
// // //     <Modal
// // //       isOpen={isOpen}
// // //       onClose={onClose}
// // //       title={editingSantri ? "Update Data" : "Santri Baru"}
// // //     >
// // //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// // //         <Input
// // //           type="text"
// // //           label="Nama Lengkap"
// // //           name={"name"}
// // //           placeholder="Nama Lengkap"
// // //           register={register("name")}
// // //           defaultValue={editingSantri?.name}
// // //           error={errors.name?.message as string}
// // //         />

// // //         <div className="grid grid-cols-2 gap-4">
// // //           {/* <Input label="NIS" name="NIS" defaultValue={editingSantri?.NIS} /> */}
// // //           <Input
// // //             type="text"
// // //             label="NIS"
// // //             name={"NIS"}
// // //             placeholder="Nomor Induk Santri"
// // //             register={register("NIS")}
// // //             defaultValue={editingSantri?.NIS}
// // //             error={errors.NIS?.message as string}
// // //           />
// // //           <SelectInput
// // //             label="Pilih Kelas"
// // //             name="kelas"
// // //             options={DAFTAR_KELAS}
// // //             defaultValue={editingSantri?.kelas}
// // //             required
// // //           />
// // //         </div>

// // //         {/* Button Action - Menggunakan gaya SidebarItem yang kamu minta */}
// // //         {/* <button
// // //           type="submit"
// // //           className="flex items-center justify-center gap-4 w-full p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 font-black text-sm mt-4"
// // //         >
// // //           <Save size={20} />
// // //           <span>SIMPAN DATA</span>
// // //         </button> */}
// // //         <button
// // //           type="submit"
// // //           disabled={isSubmitting}
// // //           className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
// // //         >
// // //           {isSubmitting ? (
// // //             <>
// // //               <Loader className="animate-spin" size={20} /> Tunggu sebentar...
// // //             </>
// // //           ) : (
// // //             <>
// // //               <Save size={20} />
// // //               SIMPAN DATA
// // //             </>
// // //           )}
// // //         </button>
// // //       </form>
// // //       <button
// // //         onClick={onClose}
// // //         className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors hidden sm:block"
// // //       >
// // //         <X size={20} />
// // //       </button>
// // //     </Modal>
// // //   );
// // // }
import { Modal } from "@/components/ui/modal";
import Input from "@/components/ui/Input"; // Pastikan default import benar
import { Loader, Save, X } from "lucide-react";
import { SelectInput } from "@/components/ui/Input";
import { StudentInput, studentSchema } from "@/lib/schemas/student.schema";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addStudent,
  updateStudentAction,
} from "@/lib/actions/students.actions"; // Tambahkan update action
import { useForm } from "react-hook-form";

const DAFTAR_KELAS = ["10-A", "10-B", "11-A", "11-B", "12-A"];

// export function StudentModal({ isOpen, onClose, editingSantri }: any) {
//   const [error, setError] = useState<string | null>(null);

//   // Di dalam StudentModal
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<StudentInput>({
//     resolver: zodResolver(studentSchema),
//     defaultValues: {
//       name: "",
//       NIS: "",
//       class: "",
//       // _id sengaja dikosongkan untuk data baru
//     },
//   });

//   // Update useEffect Reset agar memetakan _id
//   useEffect(() => {
//     if (isOpen) {
//       if (editingSantri) {
//         reset({
//           _id: editingSantri._id || editingSantri.id, // Sesuaikan dengan key dari database
//           name: editingSantri.name,
//           NIS: editingSantri.NIS,
//           class: editingSantri.class,
//         });
//       } else {
//         reset({ name: "", NIS: "", class: "" });
//       }
//     }
//   }, [editingSantri, isOpen, reset]);

//   const onSubmit = async (formData: StudentInput) => {
//     setError(null);
//     try {
//       let result;
//       if (editingSantri?.id) {
//         // Panggil action Update
//         result = await updateStudentAction(editingSantri.id, formData);
//       } else {
//         // Panggil action Add
//         result = await addStudent(formData);
//       }

//       if (result.success) {
//         reset();
//         onClose();
//       } else {
//         setError(result.message || "Gagal menyimpan data");
//       }
//     } catch (err) {
//       setError("Koneksi ke server bermasalah");
//     }
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={editingSantri ? "Update Data" : "Santri Baru"}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {error && (
//           <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
//             {error}
//           </p>
//         )}

//         {/* <Input
//           type="text"
//           label="Nama Lengkap"
//           placeholder="Nama Lengkap"
//           register={register("name")} // Terhubung ke hook-form
//           error={errors.name?.message}
//         /> */}
//         <Input
//           type="text"
//           label="Nama Lengkap"
//           name={"name"}
//           placeholder="Nama Lengkap"
//           register={register("name")}
//           defaultValue={editingSantri?.name}
//           error={errors.name?.message as string}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <Input
//             type="text"
//             label="NIS"
//             name={"NIS"}
//             placeholder="Nomor Induk Santri"
//             register={register("NIS")}
//             defaultValue={editingSantri?.NIS}
//             error={errors.NIS?.message as string}
//           />

//           <SelectInput
//             label={"Pilih Kelas"}
//             name="class"
//             options={DAFTAR_KELAS}
//             register={register("class")} // PASTIKAN NAMA FIELD SAMA DENGAN SCHEMA (class)
//             error={errors.class?.message}
//           />
//         </div>
//         {error && (
//           <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
//             {error}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader className="animate-spin" size={20} /> Tunggu sebentar...
//             </>
//           ) : (
//             <>
//               <Save size={20} />
//               {editingSantri ? "UPDATE DATA" : "SIMPAN DATA"}
//             </>
//           )}
//         </button>
//       </form>

//       <button
//         onClick={onClose}
//         className="absolute top-6 right-6 p-2 text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block"
//       >
//         <X size={20} />
//       </button>
//     </Modal>
//   );
// }
export function StudentModal({ isOpen, onClose, editingSantri }: any) {
  const [error, setError] = useState<string | null>(null);

  // Di dalam StudentModal
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      NIS: "",
      class: "",
      // _id sengaja dikosongkan untuk data baru
    },
  });

  // Update useEffect Reset agar memetakan _id
  useEffect(() => {
    if (isOpen) {
      if (editingSantri) {
        reset({
          _id: editingSantri._id || editingSantri.id, // Sesuaikan dengan key dari database
          name: editingSantri.name,
          NIS: editingSantri.NIS,
          class: editingSantri.class,
        });
      } else {
        reset({ name: "", NIS: "", class: "" });
      }
    }
  }, [editingSantri, isOpen, reset]);

  const onSubmit = async (formData: StudentInput) => {
    alert(formData);
    setError(null);
    try {
      let result;
      if (editingSantri?.id) {
        // Panggil action Update
        result = await updateStudentAction(editingSantri.id, formData);
      } else {
        // Panggil action Add
        result = await addStudent(formData);
      }

      if (result.success) {
        reset();
        onClose();
      } else {
        setError(result.message || "Gagal menyimpan data");
      }
    } catch (err) {
      setError("Koneksi ke server bermasalah");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSantri ? "Edit Santri" : "Santri Baru"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama */}
        {/* <Input
          label="Nama Lengkap"
          // register={register("name")}
          error={errors.name?.message}
          placeholder="Contoh: Ahmad Fauzi"
        /> */}
        <input
          required
          {...register("name")}
          type="text"
          placeholder={"Nama Lengkap"}
          className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
        />

        {errors.name && (
          <p className="text-red-500 text-xs px-1">{errors.name.message}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          {/* NIS */}
          {/* <Input
            label="NIS"
            // register={register("NIS")}
            error={errors.NIS?.message}
            placeholder="12345"
          /> */}
          <div>
            <input
              required
              {...register("NIS")}
              type="text"
              placeholder={"NIS"}
              className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
            />

            {errors.NIS && (
              <p className="text-red-500 text-xs px-1">{errors.NIS.message}</p>
            )}
          </div>
          {/* Kelas - Pakai register("class") */}
          {/* <SelectInput
            label="Pilih Kelas"
            options={DAFTAR_KELAS}
            register={register("class")}
            error={errors.class?.message}
          /> */}
          <div>
            <input
              required
              {...register("class")}
              type="text"
              placeholder={"Kelas"}
              className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
            />

            {errors.class && (
              <p className="text-red-500 text-xs px-1">
                {errors.class.message}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} /> {editingSantri ? "PERBARUI" : "SIMPAN"}
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

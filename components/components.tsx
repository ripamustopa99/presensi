// function SocialIcons() {
//   return (
//     <div className="flex gap-3 mt-4">
//       {[Facebook, Mail, Linkedin].map((Icon, idx) => (
//         <div key={idx} className="p-2 md:p-3 border rounded-full hover:bg-gray-50 cursor-pointer transition-shadow">
//           <Icon size={18} className="text-gray-600" />
//         </div>
//       ))}
//     </div>
//   );
// }
// const [isLoading, setIsLoading] = useState(true);

// useEffect(() => {
//   const session = sessionStorage.getItem("userSession");
//   if (!session) {
//     router.push("/signin"); // Tendang balik ke login jika belum login
//   } else {
//     const user = JSON.parse(session);
//     if (user.role !== "admin") {
//       router.push("/dasboard"); // Jika dia guru nyasar ke admin, pindahkan
//     }
//     setIsLoading(false);
//   }
// }, []);

// if (isLoading) return <p>Loading...</p>;

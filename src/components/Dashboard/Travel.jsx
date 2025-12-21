// import React from "react";
// import { useTopTravelers } from "../../hooks/useDashboard";
// import DefaultProfile from "../../assets/Images/trv_profile.jpg";
// import { useNavigate } from "react-router-dom";


// const Travel = () => {

//   const navigate = useNavigate();
//   const { data: topTravelers, isLoading, error } = useTopTravelers();



//   if (isLoading) return <p>Loading travelers...</p>;
//   if (error) return <p>Error loading travelers</p>;


//   return (
//     <div className="justify-center border-color rounded-lg p-6 flex flex-col gap-6 bg-white">
//       <h1 className="text-xl fw4 font-roboto leading-[150%] tracking-[-4%] text-[#232323]">
//         Travelers Overview
//       </h1>
//       <table className=" text-left rounded-t-lg">
//         <thead className="bg-[#F9F9F9] text-[#4F4F4F] text-sm fw5 leading-[150%] tracking-[-3%] items-center gap-2.5  h-[56px]">
//           <tr>
//             <th className="px-4 py-2.5">Customer</th>
//             <th className="p-2.5">Country</th>
//             <th className="p-2.5">Total Orders</th>
//             <th className="p-2.5">Last Active</th>
//             <th className="p-2.5">Status</th>
//           </tr>
//         </thead>
//         <tbody className="text-sm  leading-[150%] tracking-[-3%] items-center bg-[#FFFFFF]">
//           {topTravelers.map((t) => (
//             <tr key={t.id} onClick={() => navigate(`/travelers/profile/${t.id}`)} className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors">
//               <td className="p-4 flex items-center gap-3">
//                 <div><img src={t?.profile_photo} alt={t.name} className="w-6 h-6 object-cover object-center rounded-full" onError={(e) => { e.currentTarget.src = DefaultProfile; }} /></div>
//                 <div>
//                   <div className=" text-[#4F4F4F] fw4">{t.name}</div>
//                   <div className="text-[#6C6C6C] text-xs fw4">{t.email}</div>
//                 </div>
//               </td>
//               <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t.country}</td>
//               <td className="px-2.5 py-4  text-[#4F4F4F] fw5">
//                 {t?.order.length ?? 0}
//               </td>
//               <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t?.last_active}</td>
//               <td className="px-2.5 py-4">
//                 <span
//                   className={`px-3 py-1 rounded-md text-xs fw5  ${t.status === "Active"
//                       ? "bg-[#E7F7ED] text-[#088B3A]"
//                       : "bg-[#FCECD6] text-[#ED6C3C]"
//                     }`}
//                 >
//                   {t.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Travel;




import React from "react";
import { useTopTravelers } from "../../hooks/useDashboard";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import { useNavigate } from "react-router-dom";

const Travel = () => {
  const navigate = useNavigate();
  const { data: topTravelers, isLoading, error } = useTopTravelers();

  if (isLoading) return <p>Loading travelers...</p>;
  if (error) return <p>Error loading travelers</p>;

  return (
    <div className="bg-white border-color rounded-lg p-4 sm:p-6">
      <h1 className="text-lg sm:text-xl font-roboto fw4 text-[#232323] mb-4">
        Travelers Overview
      </h1>

      {/* ================= MOBILE VIEW (Cards) ================= */}
      <div className="space-y-4 lg:hidden">
        {topTravelers.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/travelers/profile/${t.id}`)}
            className="border rounded-lg p-4 flex gap-4 cursor-pointer hover:bg-[#FEF2E6] transition"
          >
            <img
              src={t.profile_photo}
              alt={t.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = DefaultProfile)}
            />

            <div className="flex-1">
              <div className="text-sm font-medium text-[#232323]">
                {t.name}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {t.email}
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Country:</span> {t.country}
                </div>
                <div>
                  <span className="font-medium">Orders:</span>{" "}
                  {t?.order?.length ?? 0}
                </div>
                <div>
                  <span className="font-medium">Last Active:</span>{" "}
                  {t.last_active}
                </div>
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      t.status === "Active"
                        ? "bg-[#E7F7ED] text-[#088B3A]"
                        : "bg-[#FCECD6] text-[#ED6C3C]"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW (Table) ================= */}
      <div className="hidden lg:block">
        <table className="w-full text-left">
          <thead className="bg-[#F9F9F9] text-sm text-[#4F4F4F] h-[56px]">
            <tr>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-2.5">Country</th>
              <th className="px-2.5">Total Orders</th>
              <th className="px-2.5">Last Active</th>
              <th className="px-2.5">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {topTravelers.map((t) => (
              <tr
                key={t.id}
                onClick={() => navigate(`/travelers/profile/${t.id}`)}
                className="hover:bg-[#FEF2E6] cursor-pointer transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={t.profile_photo}
                    alt={t.name}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = DefaultProfile)}
                  />
                  <div>
                    <div className="fw4 text-[#4F4F4F]">{t.name}</div>
                    <div className="text-xs text-[#6C6C6C]">{t.email}</div>
                  </div>
                </td>

                <td className="px-2.5 py-4 fw4 text-[#4F4F4F]">{t.country}</td>
                <td className="px-2.5 py-4 fw5">
                  {t?.order?.length ?? 0}
                </td>
                <td className="px-2.5 py-4 fw4 text-[#4F4F4F]">{t.last_active}</td>
                <td className="px-2.5 py-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs fw5 ${
                      t.status === "Active"
                        ? "bg-[#E7F7ED] text-[#088B3A]"
                        : "bg-[#FCECD6] text-[#ED6C3C]"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Travel;

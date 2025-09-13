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
    <div className="justify-center border-color rounded-lg p-6 flex flex-col gap-6 bg-white">
      <h1 className="text-xl fw4 font-roboto leading-[150%] tracking-[-4%] text-[#232323]">
        Travelers Overview
      </h1>
      <table className=" text-left rounded-t-lg">
        <thead className="bg-[#F9F9F9] text-[#4F4F4F] text-sm fw5 leading-[150%] tracking-[-3%] items-center gap-2.5  h-[56px]">
          <tr>
            <th className="px-4 py-2.5">Customer</th>
            <th className="p-2.5">Country</th>
            <th className="p-2.5">Total Orders</th>
            <th className="p-2.5">Last Active</th>
            <th className="p-2.5">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm  leading-[150%] tracking-[-3%] items-center bg-[#FFFFFF]">
          {topTravelers.map((t) => (
            <tr key={t.id} onClick={() => navigate(`/travelers/profile/${t.id}`)} className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors">
              <td className="p-4 flex items-center gap-3">
                <div><img src={t?.profile_photo} alt={t.name} className="w-6 h-6 object-cover object-center rounded-full" onError={(e) => { e.currentTarget.src = DefaultProfile; }} /></div>
                <div>
                  <div className=" text-[#4F4F4F] fw4">{t.name}</div>
                  <div className="text-[#6C6C6C] text-xs fw4">{t.email}</div>
                </div>
              </td>
              <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t.country}</td>
              <td className="px-2.5 py-4  text-[#4F4F4F] fw5">
                {t?.order.length ?? 0}
              </td>
              <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t?.last_active}</td>
              <td className="px-2.5 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs fw5  ${t.status === "Active"
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
  );
};

export default Travel;

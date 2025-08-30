import React from "react";
import rating from '../../assets/SVG/rating.svg'
import { useTopPartners } from "../../hooks/useDashboard";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import { useNavigate } from "react-router-dom";


const PartnersBySale = () => {

  const navigate = useNavigate();


  const { data: topPartners, isLoading, error } = useTopPartners();

  if (isLoading) return <p>Loading travelers...</p>;
  if (error) return <p>Error loading travelers</p>;


  return (
    <div className="justify-center border-color rounded-lg p-6 flex flex-col gap-6 bg-white">
      <h1 className="text-xl fw4 font-roboto leading-[150%] tracking-[-4%] text-[#232323]">
        Top 5 Partners by Sales
      </h1>
      <table className=" text-left rounded-t-lg">
        <thead className="bg-[#F9F9F9] text-[#4F4F4F] text-sm fw5 leading-[150%] tracking-[-3%] items-center gap-2.5 h-[56px]">
          <tr>
            <th className="px-4 py-2.5">Partner</th>
            <th className="p-2.5">Location</th>
            <th className="p-2.5">Total Sales</th>
            <th className="p-2.5">Orders</th>
            <th className="p-2.5">Rating</th>
          </tr>
        </thead>
        <tbody className="text-sm  leading-[150%] tracking-[-3%] items-center bg-[#FFFFFF]">
          {topPartners.map((t) => (
            <tr key={t.id} onClick={() => navigate(`/partners/profile/${t.id}`)} className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors">
              <td className="p-4 flex items-center gap-3">
                <div><img src={t.profile_photo} alt="adasda" className="w-6 h-6 object-cover object-center rounded-full" onError={(e) => {e.currentTarget.src = DefaultProfile;}}/></div>
                <div>
                  <div className=" text-[#4F4F4F] fw4">{t.first_name} {t.last_name}</div>
                  <div className="text-[#6C6C6C] text-xs fw4">{t.email}</div>
                </div>
              </td>
              <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t.location}</td>
              <td className="px-2.5 py-4  text-[#4F4F4F] fw5">
                ${t.total_sales}
              </td>
              <td className="px-2.5 py-4 text-[#4F4F4F] fw4">{t.delivered_orders_count}</td>
              <td className="px-2.5 py-4 flex gap-1.5">

                <img src={rating} alt="" />
                <span className="">

                  {t?.rating}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnersBySale;

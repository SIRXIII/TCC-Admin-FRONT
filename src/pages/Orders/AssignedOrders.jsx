import React, { useState } from "react";
import Eye from "../../assets/SVG/eyeorange.svg";
import { useNavigate } from "react-router-dom";

const AssignedOrders = ({ orders = [] }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(orders.map((o) => o.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-[#E7F7ED] text-[#088B3A]";
      case "Shipped":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Cancelled":
        return "bg-[#FCECD6] text-[#CA4E2E]";
      default:
        return "bg-[#E1FDFD] text-[#3E77B0]";
    }
  };



  return (
    <table className="w-full text-left text-sm leading-[150%] tracking-[-3%] border-collapse p-[0px 8px 0px 8px]">
      <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
        <tr>
          <th className="px-4 py-3">
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
              onChange={handleSelectAll}
              checked={selected.length === orders.length && orders.length > 0}
            />
          </th>
          <th className="px-4 py-3">Order ID</th>
          <th className="px-4 py-3">Traveler Name</th>
          <th className="px-4 py-3">Rider Name</th>
          <th className="px-4 py-3">ETA</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">View</th>
        </tr>
      </thead>
      <tbody className="bg-white fw4 text-[#232323]">
        {orders.map((order) => (
          <tr
            key={order.id}
            className="text-sm hover:bg-[#FEF2E6] cursor-pointer transition-colors"
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
          >
            <td className="px-4 py-3 align-middle">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                checked={selected.includes(order.id)}
                onChange={() => handleSelectOne(order.id)}
              />
            </td>
            <td className="px-4 py-3 text-[#F77F00] fw5">#ODR-{order.id}</td>
            
                        <td className="px-4 py-3">
            
                          <div className="flex gap-2.5">
                            <img
                              src={order?.traveler?.profile_photo}
                              alt="Traveler"
                              className="w-6 h-6 rounded-xl object-cover object-center"
                              onError={(e) => {
                                e.currentTarget.src = DefaultProfile;
                              }}
                            />
                            <div>
                              <p className="text-[#4F4F4F] text-sm">{order.traveler?.name}</p>
                              <p className="text-[#6C6C6C] text-xs">{order.traveler?.email}</p>
                            </div>
            
            
                          </div>
                        </td>
            
                        <td className="px-4 py-3">
                          <div className="flex gap-2.5">
                            <img
                              src={order?.partner?.profile_photo}
                              alt="Partner"
                              className="w-6 h-6 rounded-xl object-cover object-center"
                              onError={(e) => {
                                e.currentTarget.src = DefaultProfile;
                              }}
                            />
                            <div>
                              <p className="text-[#4F4F4F] text-sm">{order.partner?.name}</p>
                              <p className="text-[#6C6C6C] text-xs">{order.partner?.email}</p>
                            </div>
            
            
                          </div>
                        </td>
            
                        <td className="px-4 py-3">{order.eta || "-"}</td>
                        <td className="px-4 py-3">{order.created_at}</td>
            <td className="px-4 py-3 align-middle">
              <span
                className={`px-3 py-1 text-xs fw5 rounded-md ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </td>
                <td className="px-4 py-3">${order.total_price}</td>
            <td className="px-4 py-3 align-middle">
              <button
                className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E]"
    
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}

              >
                <img src={Eye} alt="" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssignedOrders;

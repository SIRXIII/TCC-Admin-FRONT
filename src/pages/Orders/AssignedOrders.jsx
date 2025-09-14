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
      case "In Transit":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Cancelled":
        return "bg-[#FCECD6] text-[#CA4E2E]";
    }
  };

  const handleRowClick = (e, orderId) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON" ||
      e.target.closest("button")
    ) {
      return;
    }
    navigate(`/orders/ordersdetail`);
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
            onClick={(e) => handleRowClick(e, order.id)}
          >
            <td className="px-4 py-3 align-middle">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                checked={selected.includes(order.id)}
                onChange={() => handleSelectOne(order.id)}
              />
            </td>
            <td className="px-4 py-3 align-middle">{order.orderId}</td>

            <td className="px-4 py-3 align-middle">
              <div>
                <span className="text-[#232323] block">{order.traveler?.name}</span>
                <span className="text-xs text-[#6C6C6C] block">
                  {order.traveler?.email}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 items-center">
              <div>
                <span className="text-[#232323] block">{order.rider?.name}</span>
                <span className="text-xs text-[#6C6C6C] block">
                  {order.rider?.email}
                </span>
              </div>
            </td>

            <td className="px-4 py-3 align-middle">{order.eta || "-"}</td>
            <td className="px-4 py-3 align-middle">{order.date}</td>
            <td className="px-4 py-3 align-middle">
              <span
                className={`px-3 py-1 text-xs fw5 rounded-md ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3 align-middle">${order.total}</td>
            <td className="px-4 py-3 align-middle">
              <button
                className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E]"
                onClick={() => navigate(`/orders/ordersdetail`)}
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

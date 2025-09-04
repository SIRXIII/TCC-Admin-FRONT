import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Assigned from "../../assets/SVG/assigned.svg";

const PendingOrders = ({ orders = [] }) => {
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

  const handleRowClick = (e, orderId) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON" ||
      e.target.closest("button")
    ) {
      return;
    }
    navigate(`/orders/assignrider`);
  };

  return (
    <table className="w-full text-left text-sm leading-[150%] tracking-[-3%] ">
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
          <th className="px-4 py-3">Partner Name</th>
          <th className="px-4 py-3">ETA</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>

      <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
        {orders.map((order) => (
          <tr
            key={order.id}
            className="text-sm hover:bg-[#FEF2E6] transition-colors cursor-pointer"
            onClick={(e) => handleRowClick(e, order.id)}
          >
            <td className="px-4 py-3">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                checked={selected.includes(order.id)}
                onChange={() => handleSelectOne(order.id)}
              />
            </td>

            <td className="px-4 py-3">{order.orderId}</td>

            <td className="px-4 py-3">
              <div>
                <span className="block text-[#232323]">{order.traveler?.name}</span>
                <span className="block text-xs text-[#6C6C6C]">
                  {order.traveler?.email}
                </span>
              </div>
            </td>

            <td className="px-4 py-3">
              <div>
                <span className="block text-[#232323]">{order.partner?.name}</span>
                <span className="block text-xs text-[#6C6C6C]">
                  {order.partner?.email}
                </span>
              </div>
            </td>

            <td className="px-4 py-3">{order.eta || "-"}</td>
            <td className="px-4 py-3">{order.date}</td>
            <td className="px-4 py-3">${order.total}</td>

            <td className="px-4 py-3">
              <button
                className="flex gap-2 p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00] hover:bg-[#f1e8e1] transition"
                onClick={() => navigate(`/orders/assignrider`)}
              >
                <img src={Assigned} alt="Assigned" />
                Assign Rider
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PendingOrders;

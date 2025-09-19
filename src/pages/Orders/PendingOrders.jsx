import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Assigned from "../../assets/SVG/assigned.svg";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";

const PendingOrders = ({ orders = [], handleSort, renderSortIcon }) => {
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

  return (
    <table className="w-full text-left text-sm leading-[150%] tracking-[-3%]">
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
          <th className="px-4 py-3" onClick={() => handleSort("id")}>
            Order ID {renderSortIcon("id")}
          </th>
          <th className="px-4 py-3" onClick={() => handleSort("traveler.name")}>
            Traveler Name {renderSortIcon("traveler.name")}
          </th>
          <th className="px-4 py-3" onClick={() => handleSort("partner.name")}>
            Partner Name {renderSortIcon("partner.name")}
          </th>
          <th className="px-4 py-3" onClick={() => handleSort("eta")}>
            ETA {renderSortIcon("eta")}
          </th>
          <th className="px-4 py-3" onClick={() => handleSort("created_at")}>
            Date {renderSortIcon("created_at")}
          </th>
          <th className="px-4 py-3" onClick={() => handleSort("total_price")}>
            Total {renderSortIcon("total_price")}
          </th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>

      <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
        {orders.map((order) => (
          <tr
            key={order.id}
            className="text-sm hover:bg-[#FEF2E6] transition-colors cursor-pointer"
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
          >
            <td className="px-4 py-3">
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
                  src={order?.traveler?.profile_photo || DefaultProfile}
                  alt="Traveler"
                  className="w-6 h-6 rounded-xl object-cover object-center"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div>
                  <p className="text-[#4F4F4F] text-sm">
                    {order.traveler?.name}
                  </p>
                  <p className="text-[#6C6C6C] text-xs">
                    {order.traveler?.email}
                  </p>
                </div>
              </div>
            </td>

            <td className="px-4 py-3">
              <div className="flex gap-2.5">
                <img
                  src={order?.partner?.profile_photo || DefaultProfile}
                  alt="Partner"
                  className="w-6 h-6 rounded-xl object-cover object-center"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div>
                  <p className="text-[#4F4F4F] text-sm">
                    {order.partner?.name}
                  </p>
                  <p className="text-[#6C6C6C] text-xs">
                    {order.partner?.email}
                  </p>
                </div>
              </div>
            </td>

            <td className="px-4 py-3">{order.eta || "-"}</td>
            <td className="px-4 py-3">{order.created_at}</td>
            <td className="px-4 py-3">${order.total_price}</td>

            <td className="px-4 py-3">
              <button
                className="flex gap-2 p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00] hover:bg-[#f1e8e1] transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/orders/assignrider/${order.id}`);
                }}
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

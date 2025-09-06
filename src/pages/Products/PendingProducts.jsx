import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PendingProducts = ({ products = [], openActionId, setOpenActionId }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(products.map((p) => p.id));
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
    <table className="w-full text-left text-sm border-collapse leading-[150%] tracking-[-3%]">
      <thead className="bg-[#F9F9F9] text-[#6C6C6C]">
        <tr>
          <th className="px-4 py-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-400"
              onChange={handleSelectAll}
              checked={
                selected.length === products.length && products.length > 0
              }
            />
          </th>
          <th className="px-4 py-3">Product ID</th>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">Partner Name</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>

      <tbody className="bg-white text-[#232323]">
        {products.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center py-6 text-gray-500">
              No pending products found.
            </td>
          </tr>
        ) : (
          products.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-[#FEF2E6] cursor-pointer transition-colors"
              onClick={() => navigate(`/products/productsdetail`)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-400"
                  checked={selected.includes(p.id)}
                  onChange={() => handleSelectOne(p.id)}
                />
              </td>

              <td className="px-4 py-3 text-[#4F4F4F]">{p.productId}</td>

              <td className="px-4 py-3 flex items-center gap-2">
                <img
                  src={p.image}
                  alt={p.productName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span>{p.productName}</span>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src={p.partnerAvatar}
                    alt={p.partnerName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{p.partnerName}</p>
                    <p className="text-xs text-gray-500">{p.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3   ">
                <div className=" rounded-md bg-[#F9F9F9] gap-2.5 px-3 py-1 flex justify-center ">
                  {p.category}
                </div>
              </td>

              <td className="px-4 py-3">{p.stock}</td>

              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 text-xs fw5 rounded-md ${
                    p.status === "Pending"
                      ? "bg-[#E1FDFD] text-[#3E77B0]"
                      :""
                  }`}
                >
                  {p.status}
                </span>
              </td>

              <td className="px-4 py-3">${p.price}</td>

              <td
                className="px-4 py-3 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inline-block relative">
                  <button
                    className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
                    onClick={() =>
                      setOpenActionId(openActionId === p.id ? null : p.id)
                    }
                  >
                    <FiMoreHorizontal size={20} />
                  </button>
                  {openActionId === p.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20 ">
                      <ul className="py-1 text-sm text-[#6C6C6C] ">
                        <li
                          className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer"
                          onClick={() => navigate(`/products/productsdetail`)}
                        >
                          View Details
                        </li>
                        <li className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer">
                          Approve
                        </li>
                        <li className="px-4 py-2 hover:bg-[#FEF2E6]  cursor-pointer">
                          Reject
                        </li>
                        <li className="px-4 py-2 hover:bg-[#FEF2E6]  cursor-pointer">
                          Request Info
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default PendingProducts;

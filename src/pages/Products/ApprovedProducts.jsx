import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductReqInfo from "../../components/Dialogs/ProductReqInfo";
import ActionMenu from "../../components/Partners/ActionMenu";
import { useStatusUpdateProduct } from "../../hooks/useProducts";

const ApprovedProducts = ({ paginatedProducts = [], openActionId, setOpenActionId }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

      const { mutate: statusUpdate } = useStatusUpdateProduct();
    
  

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedProducts.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

    const handleSuspendProduct = (id, status) => {
    statusUpdate({ id: id, status: status });

  }

    const statusColors = {
  Pending: "bg-[#E1FDFD] text-[#3E77B0]",
  Active: "bg-[#E7F7ED]  text-[#088B3A]",
  Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
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
                selected.length === paginatedProducts.length && paginatedProducts.length > 0
              }
            />
          </th>
          <th className="px-4 py-3">Product ID</th>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">Partner Name</th>
          <th className="px-4 py-3">Grade</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white text-[#232323]">
        {paginatedProducts.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center py-6 text-gray-500">
              No approved products found.
            </td>
          </tr>
        ) : (
          paginatedProducts.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-[#FEF2E6] cursor-pointer transition-colors"
              onClick={() => navigate(`/products/productsdetail/${p.id}`)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-400"
                  checked={selected.includes(p.id)}
                  onChange={() => handleSelectOne(p.id)}
                />
              </td>

              <td className="px-4 py-3 text-[#4F4F4F]">{p.product_id}</td>

              <td className="px-4 py-3 flex items-center gap-2">
                <img
                  src={p.primary_image}
                  alt={p.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <span>{p.name}</span>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src={p.partner?.profile_photo}
                    alt={p.partner?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{p.partner?.name}</p>
                    <p className="text-xs text-gray-500">{p.partner?.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3   ">
                <div className=" rounded-md bg-[#F9F9F9] gap-2.5 px-3 py-1 flex justify-center ">
                  {p.condition_grade}
                </div>
              </td>
              <td className="px-4 py-3">{p.stock}</td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[p.status] || "bg-gray-100 text-gray-600"
                        }`}
                >
                  {p.status}
                </span>
              </td>

              <td className="px-4 py-3">${p.buy_price}</td>

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

                   <ActionMenu
                  partner={p}
                  isOpen={openActionId === p.id}
                  setOpenActionId={setOpenActionId}
                  paginatedPartners={paginatedProducts}
                  items={[
                   
                     {
                      label: "View",
                      type: "link",
                      to: `/products/productsdetail/${p.id}`,
                    },
                    {
                      label: "Accept",
                      onClick: () => handleSuspendProduct(p.id, "accept"),
                    },
                    {
                      label: "Reject",
                      onClick: () => handleSuspendProduct(p.id, "reject"),
                    },
                    {
                      label: "Request Information",
                      onClick: (p) => {
                        setSelectedProduct(p);
                        setIsDialogOpen(true);
                      },

                    },
                  ]}
                />
                   <ProductReqInfo
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  onSend={() => setIsDialogOpen(false)}
                  product={selectedProduct}
                />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ApprovedProducts;

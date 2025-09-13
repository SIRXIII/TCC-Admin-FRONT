import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg";
import Pagination from "../../../components/Pagination";

const PartnerProducts = ({ partner }) => {
  const navigate = useNavigate();

  if (!partner) return <p className="text-center py-4">No partner data found.</p>;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const products = partner.products || [];

  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Active: "bg-[#E7F7ED]  text-[#088B3A]",
    Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  // 🔎 Search filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1); // reset page on search/filter change
  }, [filteredProducts]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#232323]">Products</h2>
          <span className="text-sm text-[#9A9A9A]">
            Total products{" "}
            <span className="fw6 text-[#232323]">{products.length}</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative text-[#9A9A9A] text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2 px-4 py-2.5 border border-[#D9D9D9] rounded-xl text-sm focus:outline-none focus:border-[#F77F00]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto min-h-[200px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">Product ID</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-[#6C6C6C]">
                    No products found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-white hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                    onClick={() => navigate(`/products/productsdetail/${p.id}`)}
                  >
                    <td className="px-4 py-3">{p.product_id}</td>

                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={p.primary_image}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => (e.currentTarget.src = DefaultProfile)}
                      />
                      <span>{p.name}</span>
                    </td>

                    <td className="px-4 py-3">{p.condition_grade}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={currentPage}
          setPage={setCurrentPage}
          perPage={itemsPerPage}
          setPerPage={setItemsPerPage}
          totalItems={filteredProducts.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default PartnerProducts;

import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg";
import Pagination from "../../../components/Pagination";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const PartnerProducts = ({ partner }) => {
  const navigate = useNavigate();

  if (!partner) return <p className="text-center py-4">No partner data found.</p>;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const products = partner.products || [];

  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Active: "bg-[#E7F7ED]  text-[#088B3A]",
    Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
      <FiArrowUp
        className={
          sortConfig.key === key && sortConfig.direction === "asc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
      <FiArrowDown
        className={
          sortConfig.key === key && sortConfig.direction === "desc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
    </span>
  );

  const filteredProducts = useMemo(() => {
    let data = [...products];
    data = data.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [products, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#232323]">Products</h2>
          <span className="text-sm text-[#9A9A9A]">
            Total products <span className="fw6 text-[#232323]">{products.length}</span>
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

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto overflow-y-auto min-h-[200px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C]">
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("product_id")}
                >
                  Product ID {renderSortIcon("product_id")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product {renderSortIcon("name")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("condition_grade")}
                >
                  Grade {renderSortIcon("condition_grade")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  Stock {renderSortIcon("stock")}
                </th>
                <th className="px-4 py-3 text-left">Status</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("buy_price")}
                >
                  Price {renderSortIcon("buy_price")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
                      <p className="text-orange-500 font-semibold text-lg">
                        No products found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting filters or check back later.
                      </p>
                    </div>
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
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[p.status] || "bg-gray-100 text-gray-600"
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

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 sm:hidden">
          {currentPageData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
              <p className="text-orange-500 font-semibold text-lg">No products found.</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting filters or check back later.</p>
            </div>
          ) : (
            currentPageData.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/products/productsdetail/${p.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 font-medium">{p.product_id}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[p.status] || "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={p.primary_image}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => (e.currentTarget.src = DefaultProfile)}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className="text-xs text-gray-500">Grade: {p.condition_grade}</span>
                    <span className="text-xs text-gray-500">Stock: {p.stock}</span>
                    <span className="text-xs text-gray-500">Price: ${p.buy_price}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            perPage={itemsPerPage}
            setPerPage={setItemsPerPage}
            totalItems={filteredProducts.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
};

export default PartnerProducts;

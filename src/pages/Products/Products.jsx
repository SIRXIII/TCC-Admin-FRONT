import React, { useState, useMemo } from "react";
import { FiSearch , FiChevronDown } from "react-icons/fi";
import ApprovedProducts from "./ApprovedProducts";
import PendingProducts from "./PendingProducts";
import Pagination from "../../components/Pagination";
import productsData from "../../data/ProductsData";

const Products = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [search, setSearch] = useState("");
  const [pageApproved, setPageApproved] = useState(1);
  const [pagePending, setPagePending] = useState(1);
  const [perPageApproved, setPerPageApproved] = useState(10);
  const [perPagePending, setPerPagePending] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);

  const approvedData = Array.isArray(productsData?.approved)
    ? productsData.approved
    : [];
  const pendingData = Array.isArray(productsData?.pending)
    ? productsData.pending
    : [];

  const currentData = activeTab === "approved" ? approvedData : pendingData;

  const page = activeTab === "approved" ? pageApproved : pagePending;
  const perPage = activeTab === "approved" ? perPageApproved : perPagePending;
  const setPage = activeTab === "approved" ? setPageApproved : setPagePending;
  const setPerPage =
    activeTab === "approved" ? setPerPageApproved : setPerPagePending;

  const filteredProducts = currentData.filter((p) => {
    const name = p.productName?.toLowerCase() || "";
    const partner = p.partnerName?.toLowerCase() || "";
    const email = p.email?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      partner.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs gap-1">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Products</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#232323]">Products</h2>
          <p className="text-[#232323] text-sm">
            View and manage all products in the platform.
          </p>
        </div>
      </div>

      <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            activeTab === "approved"
              ? "bg-orange text-white shadow"
              : "text-gray-600"
          }`}
        >
          Approved ({approvedData.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            activeTab === "pending"
              ? "bg-orange text-white shadow"
              : "text-gray-600"
          }`}
        >
          Pending ({pendingData.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="relative text-[#9A9A9A]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-2 px-4 py-2 border border-gray-300 rounded-xl text-base w-[320px] focus:outline-none"
            />
          </div>
          <button className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-0.5 text-sm text-[#9A9A9A] gap-3 max-w-[127px] h-[42px]">
            Status
            <FiChevronDown size={16} />
          </button>
        </div>

        {activeTab === "approved" ? (
          <ApprovedProducts
            products={paginatedProducts}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
          />
        ) : (
          <PendingProducts
            products={paginatedProducts}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
          />
        )}

        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredProducts.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default Products;

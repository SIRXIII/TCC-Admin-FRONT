import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import ApprovedPartners from "../components/Partners/ApprovedPartners";
import PendingPartners from "../components/Partners/PendingPartners";
import axios from "axios";
import partnersData from "../data/partnersData";
import Plus from "../assets/SVG/Plus.svg";
import arrow_left from "../assets/SVG/arrow-left.svg";
import arrow_right from "../assets/SVG/arrow-right.svg";
import {Link} from "react-router-dom";
const Partners = () => {
  const [partners, setPartners] = useState({ approved: [], pending: [] });
  const [activeTab, setActiveTab] = useState("approved");
  const [search, setSearch] = useState("");
  const [pageApproved, setPageApproved] = useState(1);
  const [pagePending, setPagePending] = useState(1);
  const [perPageApproved, setPerPageApproved] = useState(10);
  const [perPagePending, setPerPagePending] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/partners");

        if (res.data?.data) {
          const approved = res.data.data.filter((p) => p.status === "Active");
          const pending = res.data.data.filter((p) => p.status === "Pending");
          setPartners({ approved, pending });
        } else {
          setPartners(partnersData);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
        setPartners(partnersData);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const currentData = partners[activeTab];
  const page = activeTab === "approved" ? pageApproved : pagePending;
  const perPage = activeTab === "approved" ? perPageApproved : perPagePending;
  const setPage = activeTab === "approved" ? setPageApproved : setPagePending;
  const setPerPage =
    activeTab === "approved" ? setPerPageApproved : setPerPagePending;

  const filteredPartners = currentData.filter((partner) =>
    partner.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPartners.length / perPage);
  const paginatedPartners = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPartners.slice(start, start + perPage);
  }, [filteredPartners, page, perPage]);

  return (
    <div className="gap-6 mb-10">
      <div className="flex flex-col p-3 gap-4">
        <div className="flex items-center text-xs gap-1  fw4 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Partners</p>
        </div>

        <div className="flex justify-between   gap-4 ">
          <div className="gap-2  ">
            <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]  ">
              Partners
            </h2>

            {activeTab === "approved" ? (
              <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
                Browse and manage partner accounts and their product listings.
              </p>
            ) : (
              <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
                Review and approve new partner applications.
              </p>
            )}
          </div>

            <Link
              to={`/partners/add-partner`}
              className="flex items-center justify-center bg-[#F77F00] hover:bg-[#e27406] text-white text-xs font-semibold px-4 py-2 rounded-lg gap-2"
            >
              <img src={Plus} alt="plus" className="w-4 h-4" />
              <span>Add Partner</span>
            </Link>
          
        </div>
      </div>

      <div className="flex gap-4 mb-4 bg-[#FEECD9] rounded-lg p-2  w-fit">
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-1.5 rounded-md gap-1 text-sm fw5 transition ${
            activeTab === "approved"
              ? "bg-[#F77F00] text-[#FFFFFF] shadow"
              : "text-gray-600"
          }`}
        >
          Approved ({partners.approved.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === "pending"
              ? "bg-[#F77F00] text-[#FFFFFF] shadow"
              : "text-[#4F4F4F]"
          }`}
        >
          Pending ({partners.pending.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="relative text-[#9A9A9A] px-2 py-2 gap-3 text-xs leading-[150%] tracking-[-3%] ">
           <span className="absolute inset-y-0 left-0 flex items-center pl-5">
            <FiSearch size={16}/>
            </span> 
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
            />
          </div>
          <div className="flex gap-4 text-[#9A9A9A] text-xs fw4 ">
            <button className="flex items-center gap-2 border border-[#23232333] px-3 py-2 rounded-md  ">
              Category <FiChevronDown />
            </button>
            <button className="flex items-center gap-2 border border-[#23232333] px-3 py-2 rounded-md  ">
              Location <FiChevronDown />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading partners...
          </div>
        ) : activeTab === "approved" ? (
          <ApprovedPartners
            paginatedPartners={paginatedPartners}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
          />
        ) : (
          <PendingPartners
            paginatedPartners={paginatedPartners}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
          />
        )}

        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-6 text-[#6C6C6C] h-10">
            <p className="text-sm h-10 flex items-center tesxt-[#6C6C6C]">
              Showing {(page - 1) * perPage + 1} to{" "}
              {Math.min(page * perPage, filteredPartners.length)} of{" "}
              {filteredPartners.length} entries
            </p>

            <div className="flex items-center gap-2 h-10">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 transition 
             hover:bg-[#FEF2E6] hover:text-[#232323]"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <img src={arrow_left} alt="Prev" className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition ${
                      num === page
                        ? "bg-[#F77F00] text-white  border-[#F77F00]"
                        : " hover:bg-[#FEF2E6] hover:text-[#232323]"
                    }`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 transition 
             hover:bg-[#FEF2E6] hover:text-[#232323]"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <img src={arrow_right} alt="Next" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 h-10">
              <span className="text-[#232323] text-xs">Show</span>
              <div className="relative w-[62px]">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full h-10 px-3 border border-[#D9D9D9] rounded-lg text-sm text-[#232323] bg-white text-left"
                >
                  {perPage}
                </button>

                {open && (
                  <div className="absolute bottom-full mb-1 w-full bg-white border border-[#D9D9D9] rounded-lg shadow-lg z-10">
                    {[5, 10, 25, 50].map((n) => (
                      <div
                        key={n}
                        onClick={() => {
                          setPerPage(n);
                          setPage(1);
                          setOpen(false);
                        }}
                        className="px-3 py-2 text-sm text-[#232323] hover:bg-[#FEF2E6] cursor-pointer"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}

                <img
                  src={arrow_right}
                  alt="Dropdown arrow"
                  className="pointer-events-none  absolute right-2 top-1/2 w-4 h-4 -translate-y-1/2 rotate-90"
                />
              </div>
              <span className="text-[#232323] text-xs">entries</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;

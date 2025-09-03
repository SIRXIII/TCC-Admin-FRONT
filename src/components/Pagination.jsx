import React, { useState } from "react";
import arrow_left from "../assets/SVG/arrow-left.svg";
import arrow_right from "../assets/SVG/arrow-right.svg";

const Pagination = ({
  page,
  setPage,
  perPage,
  setPerPage,
  totalItems,
  options = [5, 10, 25, 50],
  fullWidth = true,
}) => {
  const [open, setOpen] = useState(false);
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-2 mt-6 text-[#6C6C6C] h-10 
        ${fullWidth ? "w-full" : "w-1/2"}`}
    >
      {/* Showing entries */}
      <p className="text-sm h-10 flex items-center">
        Showing {(page - 1) * perPage + 1} to{" "}
        {Math.min(page * perPage, totalItems)} of {totalItems} entries
      </p>

      {/* Pagination numbers */}
      <div className="flex items-center gap-2 h-10">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 transition disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <img src={arrow_left} alt="Prev" className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition ${
              num === page
                ? "bg-orange text-white border border-[#F77F00]"
                : "border border-[#FEF2E6] hover:bg-[#FEF2E6] hover:text-[#232323]"
            }`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 transition disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          <img src={arrow_right} alt="Next" className="w-4 h-4" />
        </button>
      </div>

      {/* Per Page Dropdown */}
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
              {options.map((n) => (
                <div
                  key={n}
                  onClick={() => {
                    setPerPage(n);
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
            className="pointer-events-none absolute right-2 top-1/2 w-4 h-4 -translate-y-1/2 rotate-90"
          />
        </div>
        <span className="text-[#232323] text-xs">entries</span>
      </div>
    </div>
  );
};

export default Pagination;

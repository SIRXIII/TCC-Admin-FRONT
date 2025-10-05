import React, { useState } from "react";
// import productImg from "../../../assets";
import productImg from "../../../assets/Images/Pro_img.jpg";
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";

const InfoList = ({ items }) => {

    const [previewImage, setPreviewImage] = useState(null);
  
  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Active: "bg-[#E7F7ED]  text-[#088B3A]",
    Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  return (
    <div className="flex flex-col gap-3 ">
      {items.map((item, idx) => {
        if (item.image) {
          return (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 leading-[150%] tracking-[-3%]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.value}
                  className="w-14 h-14 rounded-xl object-cover"
                  onClick={() => setPreviewImage(item.image ?? productImg)}

                  onError={(e) => { e.currentTarget.src = productImg; }}

                />
                <div>
                  <p className="text-lg fw6 text-[#232323]">
                    {item.value}
                  </p>
                  {item.sub && (
                    <p className="text-xs text-[#6C6C6C]">{item.sub}</p>
                  )}
                </div>
              </div>

              {item.status && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[item.status] || "bg-gray-100 text-gray-600"
                    }`}
                >
                  {item.status}
                </span>
              )}
            </div>
          );
        }

        // Case: Label + Value
        return (
          <div
            key={idx}
            className="flex justify-between fw5 gap-3 leading-[150%] tracking-[-3%]"
          >
            <div className="flex justify-center gap-3 text-xs">
              <span className="w-40 text-[#6C6C6C]">{item.label}</span>
              <span className="text-[#9A9A9A] text-sm"> : </span>

              {/* ✅ Partner Store (orange underline) */}
              {item.label === "Partner Store" ? (
                <span className="text-[#F77F00] underline fw5 cursor-pointer">
                  {item.value}
                </span>
              ) : item.label === "Product Verification Status" ? (
                <span
                  className={` py-1 text-xs fw5${item.value === "Verified"
                    ? " text-[#088B3A]"
                    : item.value === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                    }`}
                >
                  {item.value}
                </span>
              ) : (
                // Default
                <span className="text-[#232323]">{item.value}</span>
              )}
            </div>
          </div>
        );
      })}
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />

    </div>
  );
};

export default InfoList;

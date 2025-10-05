
import { useDownloadPartnersZip } from "../../../hooks/usePartners";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg"
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";
import { useState } from "react";


const PartnerInfo = ({ items, partnerId }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const { mutate: downloadZip, isLoading } = useDownloadPartnersZip();
  return (
    <div className="flex flex-col gap-4 ">
      {items.map((item, idx) => {
        if (item.image) {
          return (
            <div key={idx} className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.value}
                  className="w-14 h-14 rounded-xl object-cover cursor-pointer"
                  onClick={() => setPreviewImage(item.image)}

                  onError={(e) => { e.currentTarget.src = DefaultProfile; }}
                />
                <div>
                  <p className="text-lg font-medium text-[#232323]">
                    {item.value}
                  </p>
                  {item.email && (

                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`mailto:${item?.email}`} className="hover:underline">
                        {item?.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {item.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs fw5 ${item.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : item.status === "Suspended"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {item.status}
                </span>
              )}
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="flex items-center justify-between fw5 gap-2"
          >
            <div className="flex  gap-2 text-xs">
              <span className="w-40 text-[#6C6C6C]">{item.label}</span>
              <span className=" text-[#9A9A9A] text-sm"> : </span>
              <span className="w-70 text-[#232323]">
                {item.label.toLowerCase().includes("email") ? (
                  <a href={`mailto:${item.value}`} className="hover:underline">
                    {item.value}
                  </a>
                ) : item.label.toLowerCase().includes("phone") ? (
                  <a href={`tel:${item.value}`} className="hover:underline">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </span>
              {/* <span className="w-70 text-[#232323]">{item.value}</span> */}
            </div>

            {item.actions && item.actions.length > 0 && (
              <div className="flex gap-2">
                {item.actions.map((action, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    className="border border-[#F77F00] bg-[#F77F00] rounded-lg px-4 py-2 text-sm text-[#FEF2E6] disabled:opacity-50"
                    onClick={() => {
                      if (!item.docUrl || item.docUrl.length === 0) return;

                      if (action === "View") {

                        item.docUrl.forEach((url) =>
                          window.open(url, "_blank")
                        );
                      } else if (action === "Download") {

                        downloadZip(partnerId);
                      }
                    }}
                  >
                    {isLoading && action === "Download" ? "Downloading..." : action}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />

    </div>
  );
};

export default PartnerInfo;

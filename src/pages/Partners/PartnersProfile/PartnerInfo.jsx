import { useDownloadPartnersZip } from "../../../hooks/usePartners";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg";
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";
import { useState } from "react";

const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;

const PartnerInfo = ({ items, partnerId }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const { mutate: downloadZip, isLoading } = useDownloadPartnersZip();

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, idx) => {
        if (!item) return null;

        // Image section
        if (item.image) {
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.value}
                  className="w-20 h-20 sm:w-12 sm:h-12 rounded-xl object-cover cursor-pointer"
                  onClick={() => setPreviewImage(item.image)}
                  onError={(e) => {
                    e.currentTarget.src = DefaultProfile;
                  }}
                />
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-[#232323] truncate">
                    {item.value}
                  </p>
                  {item.email && (
                    <p className="text-xs text-[#6C6C6C] truncate">
                      <a href={`mailto:${item.email}`} className="hover:underline">
                        {item.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {item.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs fw5 mt-2 sm:mt-0 text-center ${item.status === "Active"
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

        if (!item.label) return null;

        const labelLower = item.label.toLowerCase();

        return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <div className="flex     sm:items-center gap-1 text-xs sm:text-sm">
              <span className="sm:w-40 text-[#6C6C6C] truncate">{item.label}</span>
              <span className="text-[#9A9A9A]">:</span>
              <span className="sm:w-70 text-[#232323] break-words">
                {labelLower.includes("email") ? (
                  <a href={`mailto:${item.value}`} className="hover:underline">
                    {item.value}
                  </a>
                ) : labelLower.includes("phone") ? (
                  <a href={`tel:${item.value}`} className="hover:underline">
                    {item.value}
                  </a>
                ) : labelLower.includes("address") ? (
                  <a
                    href={
                      item.latitude && item.longitude
                        ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
                        : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(
                          item.value || ""
                        )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-words block sm:inline"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </span>

            </div>

            {item.actions && item.actions.length > 0 && (
              <div className="flex flex-col-2  gap-2  sm:mt-0 sm:justify-end self-end ">
                {item.actions.map((action, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    className="border border-[#F77F00] bg-[#F77F00] rounded-lg px-4 py-2 text-sm text-[#FEF2E6] disabled:opacity-50 whitespace-nowrap"
                    onClick={() => {
                      if (!item.docUrl || item.docUrl.length === 0) return;

                      if (action === "View") {
                        item.docUrl.forEach((url) => window.open(url, "_blank"));
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
      <ImagePreviewGallery
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default PartnerInfo;

import React from "react";

const PartnerTabs = ({ activeTab, setActiveTab, partner }) => {

const tabs = [
  { key: "details", label: "Details" },
  { key: "products", label: `Products (${partner?.products?.length || 0})` },
  { key: "orders", label: `Orders (${partner?.order?.length || 0})` },
];

  return (
    <div className="flex gap-2 bg-[#FEECD9] rounded-lg p-2 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-orange text-white shadow"
              : "text-[#4F4F4F]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PartnerTabs;

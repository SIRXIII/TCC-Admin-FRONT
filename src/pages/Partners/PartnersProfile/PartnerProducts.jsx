import React from "react";

const ProductsTab = ({partner}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAEAEA]">
      <h3 className="text-lg font-semibold mb-4">Products</h3>
      <p className="text-sm text-[#6C6C6C]">
        Here you’ll show the partner’s products list (table or cards).
      </p>
    </div>
  );
};

export default ProductsTab;

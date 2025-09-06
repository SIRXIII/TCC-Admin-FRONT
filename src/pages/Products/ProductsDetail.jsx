import React from "react";
import backward from "../../assets/SVG/backward.svg";
import InfoList from "./ProDetail/InfoList";
import productDetailData from "../../data/ProductDetailData";

const ProductsDetail = () => {
  const data = productDetailData;

  const productDetails = {
    overview: {
      title: "Product Overview",
      items: [
        {
          image: data.images[0],
          value: data.name,
          sub: data.category,
          status: data.availability,
        },
        { label: "Product Category", value: data.category },
        { label: "Product Type", value: data.type },
        { label: "Price", value: data.price },
        { label: "Security Deposit", value: data.deposit },
        { label: "Partner Store", value: data.partnerStore },
      ],
    },

    rental: {
      title: "Rental Parameters",
      items: [
        {
          label: "Rental Duration Options",
          value: data.rentalParams.durationOptions,
        },
        { label: "Late Fee", value: data.rentalParams.lateFee },
        { label: "Size Options", value: data.rentalParams.sizes },
        { label: "Color Options", value: data.rentalParams.colors },
        { label: "Fabric / Material", value: data.rentalParams.fabric },
        { label: "Returns Completed", value: data.rentalParams.returns },
        { label: "Cancelled Assignments", value: data.rentalParams.cancelled },
      ],
    },

    verification: {
      title: "Verification",
      items: [
        { label: "Product Verification Status", value: data.verification },
      ],
    },
  };

  return (
    <div className="flex flex-col p-2  gap-6">
      <div className="flex items-center text-xs fw4  text-[#6C6C6C] gap-1 leading-[150%] tracking-[-3%]">
        <span>Dashboard</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-[#F77F00] capitalize">Details</span>
      </div>

      <div className="flex  items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <img src={backward} alt="" />
            <h1 className="text-2xl  font-roboto fw6 text-[#232323]">
              Product Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
            View, verify and manage product listed by partners.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition">
            Suspend
          </button>
          <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition">
            Edit Details
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="col-span-2 flex flex-col  gap-6">
          {Object.values(productDetails).map((section, idx) => (
            <div
              key={idx}
              className="bg-white p-6  rounded-lg shadow flex flex-col gap-6"
            >
              <h3 className="text-lg fw6">{section.title}</h3>
              <InfoList items={section.items} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow">
            <h3 className="text-lg fw6 ">Product Image</h3>
            <img
              src={data.images[0]}
              alt="product"
              className="w-full h-56 object-cover rounded-2xl border-color"
            />
            <div className="flex gap-3 mt-3">
              {data.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-16 h-16 rounded-[10px] object-cover border-color hover:border-[#F77F00]"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow">
            <h3 className="text-lg fw6 mb-3">Product Video</h3>

            <div className="relative">
              <img
                src={data.videoThumbnail}
                alt="video"
                className="w-full h-56 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;

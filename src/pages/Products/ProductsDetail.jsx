import React, { useEffect, useState } from "react";
import backward from "../../assets/SVG/backward.svg";
import InfoList from "./ProDetail/InfoList";
import productDetailData from "../../data/ProductDetailData";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import ProductVideo from "../../components/ProductVideo";
import { useStatusUpdateProduct } from "../../hooks/useProducts";
import { toast } from "react-toastify";
import productImg from "../../assets/Images/Pro_img.jpg";
import ImagePreviewGallery from "../../components/ImagePreviewGallery";


const ProductsDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = React.useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { mutate: statusUpdate } = useStatusUpdateProduct();

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);


  const handleProductStatus = (product) => {

    console.log("product", product);
    const newStatus = product.status === "Active" ? "suspended" : "accept";

    statusUpdate(
      { id: product.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Product ${newStatus === "accept" ? "suspended" : "activated"} successfully!`
          );
          fetchProduct();
        },
        onError: () => {
          toast.error("Failed to update product status");
        },
      }

    );
  };

  const productDetails = {
    overview: {
      title: "Product Overview",
      items: [
        {
          image: product?.primary_image,
          value: product?.name,
          sub: product?.category,
          status: product?.status,
        },
        { label: "Product Category", value: product?.category },
        { label: "Product Type", value: product?.type },
        { label: "Price", value: product?.buy_price },
        { label: "Security Deposit", value: product?.deposit },
        { label: "Availablity", value: product?.stock > 0 ? "In Stock" : "Out of Stock" },
        { label: "Partner Store", value: product?.partner?.business_name },
      ],
    },


    rental:
      product?.type == "Rental"
        ? {
          title: "Rental Parameters",
          items: [
            {
              label: "Rental Duration Options",
              value:
                product?.min_rental + " to " + product?.max_rental + " days",
            },
            {
              label: "Late Fee",
              value: "$" + product?.late_fee + "/day after return date",
            },
            { label: "Size Options", value: product?.size },
            { label: "Color Options", value: product?.color },
            { label: "Fabric / Material", value: product?.material },
            {
              label: "Returns Completed",
              value: product?.rental_stats?.completed_rentals,
            },
            {
              label: "Cancelled Rentals",
              value: product?.rental_stats?.cancelled_rentals,
            },
          ],
        }
        : {
          title: "Formal Purchase Details",
          items: [
            { label: "Price", value: product?.buy_price },
            { label: "Available Sizes", value: product?.size },
            { label: "Available Colors", value: product?.color },
            { label: "Fabric / Material", value: product?.material },
            { label: "Stock Quantity", value: product?.stock },
          ],
        },

    verification: {
      title: "Verification",
      items: [
        { label: "Product Verification Status", value: product?.verification_status },
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
            {/* <img src={backward} alt="" /> */}
            <Link to="/products" className="group">
              <img
                src={backward}
                alt="backward"
                className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
            <h1 className="text-2xl  font-roboto fw6 text-[#232323]">
              Product Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
            View, verify and manage product listed by partners.
          </p>
        </div>
        <div className="flex gap-2">

          <button
            onClick={() => handleProductStatus(product)}
            className={`border rounded-lg px-4 py-2 text-sm transition ${product?.status == "Active"
              ? "border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]"
              : "border-green-600 bg-green-50 text-green-600"
              }`}
          >
            {product && product?.status === "Active" ? "Suspended" : "Activate"}
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
              src={product?.primary_image}
              alt="product"
              className="w-full h-60 object-cover rounded-2xl border-color"
              onClick={() => setPreviewImage(product?.primary_image ?? productImg)}
              onError={(e) => { e.currentTarget.src = productImg; }}

            />
            <div className="flex gap-3">
              {product?.images.map((img, i) =>
                i > 0 ? (
                  <img
                    key={i}
                    src={img?.image_url}
                    alt={`thumb-${i}`}
                    onClick={() => setPreviewImage(img?.image_url ?? productImg)}
                    className="w-17 h-17 rounded-[10px] object-cover border-color hover:border-[#F77F00]"
                    onError={(e) => { e.currentTarget.src = productImg; }}

                  />
                ) : null
              )}
            </div>

          </div>
          <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow">
            <h3 className="text-lg fw6 mb-3">Product Video</h3>

            {product?.videos?.length > 0 ? (
              <ProductVideo video={product.videos[0]} />
            ) : (
              <p className="text-gray-500">No product video available.</p>
            )}
          </div>


        </div>
      </div>
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
};

export default ProductsDetail;

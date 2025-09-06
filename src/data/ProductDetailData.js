// src/data/ProductDetailData.js
import Pro_img from "../assets/Images/Pro_img.jpg";
import productImg2 from "../assets/Images/Pro_img.jpg";
import productImg3 from "../assets/Images/Pro_img.jpg";
import productVideoThumb from "../assets/Images/Pro_img.jpg";


const productDetailData = {
  id: 1,
  name: "Silk Kimono Suit",
  category: "Women → Suits",
  type: "Formal / Rental",
  price: "Rental Price $75 / 3 Days",
  deposit: "$200",
  availability: "Available",
  partnerStore: "Elite Rentals - NYC",
  rentalParams: {
    durationOptions: "3 Days, 7 Days, 14 Days",
    lateFee: "$15/day after return date",
    sizes: "US 36R, 38R, 40R, 42R",
    colors: "Navy Blue, Black",
    fabric: "100% Wool",
    returns: "243",
    cancelled: "12",
  },
  verification: "Verified",

  // ✅ Local asset images
  images: [Pro_img, productImg2, productImg3],

  // ✅ Local video thumbnail
  videoThumbnail: productVideoThumb,
};

export default productDetailData;

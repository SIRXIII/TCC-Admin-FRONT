import Pro_img from "../assets/Images/Pro_img.jpg";
import productImg2 from "../assets/Images/Pro_img.jpg";
import productImg3 from "../assets/Images/Pro_img.jpg";

export const RefundData = {
  orderInfo: {
    date: "January 8, 2023",
    items: "20 items",
    eta: "2hrs",
    status: "Pending",
    total: 1227.7,
  },
  items: [
    {
      name: "Nike Air Force 1’07 LV8",
      price: 122.27,
      qty: 1,
      total: 122.27,
      img: "",
    },
    {
      name: "Nike Sportswear Heritage86 Futura Washed",
      price: 15.95,
      qty: 1,
      total: 15.95,
      img: "",
    },
    {
      name: "Nike Air Max Penny",
      price: 182.5,
      qty: 1,
      total: 182.5,
      img: "",
    },
    {
      name: "Nike Windrunner D.Y.E.",
      price: 102.43,
      qty: 3,
      total: 307.29,
      img: "",
    },
    {
      name: "Nike Storm-FIT x Stüssy",
      price: 95.4,
      qty: 4,
      total: 381.6,
      img: "",
    },
    {
      name: "Nike Everyday Plus Cushioned",
      price: 122.27,
      qty: 10,
      total: 611.53,
      img: "",
    },
  ],
  transactions: {
    method: "PayPal",
    fees: 25,
    date: "January 7, 2023",
    total: 1227.7,
  },
  customer: {
    name: "Jack Paul",
    email: "jackpaul@mail.com",
    img: "/images/customer.jpg",
    reason:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ",
   evidence: [Pro_img, productImg2, productImg3],
  },
  partner: {
    name: "Fashion Botique",
    email: "fashionbotique@mail.com",
    img: "",
    address:
      "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178, Rusia",
  },
  rider: {
    name: "Mike Jason",
    email: "mikejason@mail.com",
    img: "",
    address:
      "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178, Rusia",
  },
  contact: {
    name: "Jack Paul",
    email: "Jackpaul@mail.com",
    phone: "+38 (094) 730-24-25",
  },
  shippingAddress: {
    name: "Jack Paul",
    address:
      "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178, Rusia",
  },
  billingAddress: {
    name: "Jack Paul",
    address:
      "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178, Rusia",
  },
};

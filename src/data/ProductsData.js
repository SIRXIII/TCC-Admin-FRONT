// src/data/ProductsData.js
const productsData = {
  approved: [
    {
      id: 1,
      productId: "P-001",
      productName: "Beach Hat",
      partnerName: "John Doe",
      email: "john@example.com",
      image: "https://via.placeholder.com/80x80.png?text=Product",
      partnerAvatar: "https://via.placeholder.com/40x40.png?text=JD",
      category: "Apparel",
      stock: 45,
      status: "Active",   // 👈 must match ApprovedProducts (expects "Active")
      price: 499,
    },
    {
      id: 2,
      productId: "P-002",
      productName: "Leather Tote",
      partnerName: "Jane Smith",
      email: "jane@example.com",
      image: "https://via.placeholder.com/80x80.png?text=Shoes",
      partnerAvatar: "https://via.placeholder.com/40x40.png?text=JS",
      category: "Jewelry",
      stock: 120,
      status: "Active",
      price: 89,
    },
  ],
  pending: [
    {
      id: 3,
      productId: "P-003",
      productName: "Leather Tote",
      partnerName: "Alex Brown",
      email: "alex@example.com",
      image: "https://via.placeholder.com/80x80.png?text=Wallet",
      partnerAvatar: "https://via.placeholder.com/40x40.png?text=AB",
      category: "Jewelry",
      stock: 20,
      status: "Pending", // 👈 must match PendingProducts (expects "Pending")
      price: 59,
    },
    {
      id: 4,
      productId: "P-004",
      productName: "Beach Hat",
      partnerName: "Chris Green",
      email: "chris@example.com",
      image: "https://via.placeholder.com/80x80.png?text=Mouse",
      partnerAvatar: "https://via.placeholder.com/40x40.png?text=CG",
      category: "Apparel",
      stock: 80,
      status: "Pending",
      price: 39,
    },
  ],
};

export default productsData;

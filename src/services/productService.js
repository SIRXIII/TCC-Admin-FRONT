import API from "./api";


export const getAllProducts = () => API.get("/products?paginate=false");

export const getProductById = (id) => API.get(`/products/${id}`);



export const statusUpdateProduct = (productId, status) => {
  return API.post("/products/status-update", {
    id: productId,
    status,
  });
};
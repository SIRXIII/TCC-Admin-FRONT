import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, statusUpdateProduct } from "../services/productService";


export const useProducts = () => {

  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    select: (res) => {
      // API returns: { success: true, data: [...products], message: "..." }
      // or with pagination: { success: true, data: { products: [...], pagination: {...} }, message: "..." }
      let products = [];
      
      if (res.data?.data) {
        // Check if it's paginated response or direct array
        if (Array.isArray(res.data.data)) {
          products = res.data.data;
        } else if (res.data.data.products && Array.isArray(res.data.data.products)) {
          products = res.data.data.products;
        }
      }
      
      return {
        approved: products.filter((p) => p.status === "Active" || p.status === "active"),
        suspended: products.filter((p) => p.status === "Suspended" || p.status === "suspended"),
        pending: products.filter((p) => p.status === "Pending" || p.status === "pending"),
      };
    },
  });

}



export const useStatusUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => statusUpdateProduct(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
  
    },
  });
};
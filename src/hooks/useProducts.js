import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, statusUpdateProduct } from "../services/productService";


export const useProducts = () => {

  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    select: (res) => {
      const products = res.data?.data || [];
      return {
        approved: products.filter((p) => p.status === "Active" ),
        suspended: products.filter((p) => p.status === "Suspended" ),
        pending: products.filter((p) => p.status === "Pending" ),
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
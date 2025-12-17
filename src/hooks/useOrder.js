import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrders } from "../services/orderService";


export const useOrders = () => {

  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    select: (res) => {
      // API response structure: { success: true, data: { orders: [...], pagination: {...} } }
      let orders = [];
      
      try {
        if (res?.data?.data) {
          // Check if it's paginated response with orders array
          if (Array.isArray(res.data.data.orders)) {
            orders = res.data.data.orders;
          } 
          // Check if data is directly an array (fallback)
          else if (Array.isArray(res.data.data)) {
            orders = res.data.data;
          }
        }
      } catch (error) {
        console.error('Error parsing orders data:', error);
        orders = [];
      }
      
      // Ensure orders is always an array before filtering
      if (!Array.isArray(orders)) {
        orders = [];
      }
      
      return {
        pending: orders.filter((o) => o?.status === "Pending" && (!o?.rider || o?.rider === null)),
        approved: orders.filter((o) => o?.status !== "Pending" || (o?.rider && o?.rider !== null)),
      };
    },
  });

}
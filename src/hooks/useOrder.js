import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrders } from "../services/orderService";


export const useOrders = () => {

  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    select: (res) => {
      const orders = res.data?.data || [];
      return {
      
        pending: orders.filter((o) => o.status === "Pending" && o.rider === null),
        approved: orders.filter((o) => o.status !== "Pending" || o.rider !== null),
      };
    },
  });

}
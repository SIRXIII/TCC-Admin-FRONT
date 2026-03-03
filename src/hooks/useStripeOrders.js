import { useQuery } from "@tanstack/react-query";
import { getStripeOrders } from "../services/orderService";

export const useStripeOrders = (params) => {
  return useQuery({
    queryKey: ["stripe-orders", params],
    queryFn: () => getStripeOrders(params),
    select: (res) => {
      try {
        const data = res?.data?.data;
        if (data?.orders) return data.orders;
        if (Array.isArray(data)) return data;
        return [];
      } catch {
        return [];
      }
    },
  });
};

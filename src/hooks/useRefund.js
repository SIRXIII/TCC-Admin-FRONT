import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRefunds, statusUpdateRefund } from "../services/refundService";



export const useRefunds = () => {
  return useQuery({
    queryKey: ["refunds"],
    queryFn: getAllRefunds,
    select: (res) => {
      // API returns: { success: true, data: [...refunds], message: "..." }
      // or with pagination: { success: true, data: { refunds: [...], pagination: {...} }, message: "..." }
      let refunds = [];
      
      try {
        if (res?.data?.data) {
          // Check if it's paginated response or direct array
          if (Array.isArray(res.data.data)) {
            refunds = res.data.data;
          } else if (res.data.data.refunds && Array.isArray(res.data.data.refunds)) {
            refunds = res.data.data.refunds;
          }
        }
      } catch (error) {
        console.error('Error parsing refunds data:', error);
        refunds = [];
      }
      
      // Ensure refunds is always an array
      if (!Array.isArray(refunds)) {
        refunds = [];
      }
      
      return refunds;
    },
  });
};


export const useStatusUpdateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => statusUpdateRefund(id, status),
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    },
  });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRefunds, statusUpdateRefund } from "../services/refundService";



export const useRefunds = () => {
  return useQuery({
    queryKey: ["refunds"],
    queryFn: getAllRefunds,
    select: (res) => res.data.data || [], 
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
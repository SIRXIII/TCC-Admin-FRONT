import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPartners } from "../services/partnerService";


export const usePartners = () => {

      return useQuery({
        queryKey: ["partners"],
        queryFn: getPartners,
        select: (res) => res.data.data || [], 
      });

}


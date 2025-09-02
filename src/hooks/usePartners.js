import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadPartners, getAllPartners, statusUpdatePartner } from "../services/partnerService"


export const usePartners = () => {

  return useQuery({
    queryKey: ["partners"],
    queryFn: getAllPartners,
    select: (res) => {
      const partners = res.data?.data || [];
      return {
        approved: partners.filter((p) => p.status === "Active"),
        pending: partners.filter((p) => p.status === "Pending"),
        suspended: partners.filter((p) => p.status === "Suspended"),
      };
    },
  });

}


export const useStatusUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => statusUpdatePartner(id, status),
    onSuccess: () => {
      // queryClient.invalidateQueries(["partners"]);
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
};


export const useDownloadPartnersZip = () => {
  return useMutation({
    mutationFn: downloadPartners, 
    onSuccess: (res, partnerId) => {
      const blob = new Blob([res.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `partner-${partnerId}-documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (err) => {
      console.error("Download failed", err);
    },
  });
};
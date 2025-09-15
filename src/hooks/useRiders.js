import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadRiders, getAllRiders, statusUpdateRider } from "../services/riderService";
import { toast } from "react-toastify";


export const useRiders = () => {
  return useQuery({
    queryKey: ["riders"],
    queryFn: getAllRiders,
    select: (res) => res.data.data || [], 
  });
};


export const useDownloadRiderZip = () => {
  return useMutation({
    mutationFn: downloadRiders, 
    onSuccess: (res, riderId) => {
      const blob = new Blob([res.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `rider-${riderId}-documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (err) => {
      const message =
        err?.response?.data?.error || "Download failed. Please try again.";
      toast.error(message);
    },
  });
};


export const useStatusUpdateRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => statusUpdateRider(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
  });
};
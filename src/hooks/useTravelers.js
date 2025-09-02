import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravelers, bulkUpdateTravelers, exportTravelers, deleteTraveler  } from "../services/travelerService";


export const useTravelers = () => {
  return useQuery({
    queryKey: ["travelers"],
    queryFn: getTravelers,
    select: (res) => res.data.data || [], 
  });
};


export const useDeleteTravelers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteTraveler(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["travelers"]);
    },
  });
};

export const useBulkUpdateTravelers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }) => bulkUpdateTravelers(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["travelers"]);
    },
  });
};


export const useExportTravelers = () => {
  return useMutation({
    mutationFn: (ids) => exportTravelers(ids),
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "travelers.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};



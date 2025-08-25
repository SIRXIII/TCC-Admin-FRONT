import { useQuery } from "@tanstack/react-query";
import { getTravelers, getTopPartners, getStates } from "../services/dashboardService";

export const useWidgets = () => {
  return useQuery({
    queryKey: ["widgetData"],
    queryFn: getStates,
    select: (res) => res.data,
  });
};




export const useTravelers = () => {
  return useQuery({
    queryKey: ["travelers"],
    queryFn: getTravelers,
    select: (res) => res.data,
  });
};


export const useTopPartners = () => {
  return useQuery({
    queryKey: ["topPartners"],
    queryFn: getTopPartners,
    select: (res) => res.data,
  });
};

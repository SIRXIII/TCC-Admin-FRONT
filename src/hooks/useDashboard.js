import { useQuery } from "@tanstack/react-query";
import { getTopTravelers, getTopPartners, getStates, getOrderStats } from "../services/dashboardService";

export const useWidgets = () => {
  return useQuery({
    queryKey: ["widgetData"],
    queryFn: getStates,
    select: (res) => res.data,
  });
};




export const useTopTravelers = () => {
  return useQuery({
    queryKey: ["topTravelers"],
    queryFn: getTopTravelers,
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

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["orderStats"],
    queryFn: getOrderStats,
    select: (res) => {
      const orders = res.data || [];
      
      // Calculate order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Map to chart format with colors
      const orderStatusData = [
        { 
          label: "Completed", 
          value: statusCounts['Completed'] || statusCounts['Delivered'] || 0, 
          color: "#F77F00" 
        },
        { 
          label: "Pending", 
          value: statusCounts['Pending'] || 0, 
          color: "#FF6B35" 
        },
        { 
          label: "Cancelled", 
          value: statusCounts['Cancelled'] || 0, 
          color: "#FFA500" 
        },
        { 
          label: "In Transit", 
          value: statusCounts['In Transit'] || statusCounts['Processing'] || 0, 
          color: "#FFD700" 
        }
      ];

      const totalOrders = orders.length;
      
      return {
        orderStatusData,
        totalOrders,
        rawData: orders
      };
    },
  });
};

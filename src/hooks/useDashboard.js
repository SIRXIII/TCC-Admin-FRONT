import { useQuery } from "@tanstack/react-query";
import { getTopTravelers, getTopPartners, getStates, getOrderStats, latestNotification } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

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



export const useLatestNotification = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: latestNotification,
    select: (res) => res.data,
  });
};



export const useOrderStats = () => {
  // Get authentication status from context (reactive)
  const { isAuthenticated, token } = useAuth();
  const authCheck = isAuthenticated(); // Check authentication status
  
  return useQuery({
    queryKey: ["orderStats"],
    queryFn: getOrderStats,
    enabled: authCheck && !!token, // Only fetch when authenticated and token exists
    refetchOnMount: true, // Always refetch when component mounts (especially after login)
    refetchOnWindowFocus: false, // Optional: disable refetch on window focus to avoid unnecessary calls
    staleTime: 0, // Always consider data stale, so it refetches
    retry: 1, // Retry once if it fails
    select: (res) => {
      // API returns: { success: true, data: { totalOrders, statusDistribution, orders: [...] }, message: "..." }
      const orderData = res.data || {};
      const orders = orderData.orders || [];
      const statusDist = orderData.statusDistribution || {};
      
      // Map to chart format with colors
      const orderStatusData = [
        { 
          label: "Completed", 
          value: statusDist.completed || statusDist.delivered || 0, 
          color: "#F77F00" 
        },
        { 
          label: "Pending", 
          value: statusDist.pending || 0, 
          color: "#FF6B35" 
        },
        { 
          label: "Cancelled", 
          value: statusDist.cancelled || 0, 
          color: "#FFA500" 
        },
        { 
          label: "In Transit", 
          value: statusDist.processing || statusDist.shipped || 0, 
          color: "#FFD700" 
        }
      ];

      const totalOrders = orderData.totalOrders || orders.length;
      
      return {
        orderStatusData,
        totalOrders,
        rawData: orders
      };
    },
  });
};

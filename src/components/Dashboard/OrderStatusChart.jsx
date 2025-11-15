import React from "react";
import { useOrderStats } from "../../hooks/useDashboard";

const OrderStatusChart = () => {
  // Fetch dynamic order data from API
  const { data: orderData, isLoading, error } = useOrderStats();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border-color p-6 h-full flex flex-col">
        <h2 className="text-lg font-roboto fw4 text-[#232323] leading-[150%] tracking-[-0.04em] mb-4">
          Order Status Distribution
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            <div className="w-56 h-56 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border-color p-6 h-full flex flex-col">
        <h2 className="text-lg font-roboto fw4 text-[#232323] leading-[150%] tracking-[-0.04em] mb-4">
          Order Status Distribution
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            <div className="w-56 h-56 bg-red-100 rounded-full flex items-center justify-center">
              <p className="text-red-500">Error</p>
            </div>
          </div>
          <p className="text-red-500">Error loading orders</p>
        </div>
      </div>
    );
  }

  // Use dynamic data from API
  const orderStatusData = orderData?.orderStatusData || [];
  const total = orderData?.totalOrders || 0;
  
  // Filter out zero values and calculate angles for pie chart
  const filteredOrderData = orderStatusData.filter(item => item.value > 0);
  
  let currentAngle = 0;
  const pieSlices = filteredOrderData.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    // Convert angles to radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    // Calculate path for SVG arc
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div className="bg-white rounded-lg border-color p-6 h-full flex flex-col">
      {/* Title back at the top */}
      <h2 className="text-lg font-roboto fw4 text-[#232323] leading-[150%] tracking-[-0.04em] mb-4">
        Order Status Distribution
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Pie Chart - Larger and Centered */}
        <div className="relative mb-4">
          <svg width="220" height="220" viewBox="0 0 200 200">
            {pieSlices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
                title={`${slice.label}: ${slice.percentage}%`}
              />
            ))}
          </svg>
          
          {/* Center label - just the number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#232323]">{total}</div>
            </div>
          </div>
        </div>

        {/* "Total Orders" text below the chart */}
        <div className="text-center mb-4">
          <div className="text-sm text-[#9A9A9A] font-medium">Total Orders</div>
        </div>

        {/* Compact Legend */}
        <div className="w-full space-y-2">
          {filteredOrderData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs font-medium text-[#232323] truncate">
                  {item.label}
                </span>
              </div>
              <div className="text-xs text-[#9A9A9A] ml-2">
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;

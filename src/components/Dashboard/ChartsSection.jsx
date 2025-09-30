import React from "react";
import MonthlyOrdersTrend from "./MonthlyOrdersTrend";
import OrderStatusChart from "./OrderStatusChart";

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Line Chart - takes 3/5 of the space (60%) */}
      <div className="xl:col-span-3">
        <MonthlyOrdersTrend />
      </div>
      
      {/* Pie Chart - takes 2/5 of the space (40%) */}
      <div className="xl:col-span-2">
        <OrderStatusChart />
      </div>
    </div>
  );
};

export default ChartsSection;

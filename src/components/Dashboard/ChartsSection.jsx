import React from "react";
import MonthlyOrdersTrend from "./MonthlyOrdersTrend";
import OrderStatusChart from "./OrderStatusChart";

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Line Chart */}
      <div className="xl:col-span-3">
        <MonthlyOrdersTrend />
      </div>

      {/* Pie Chart */}
      <div className="xl:col-span-2">
        <OrderStatusChart />
      </div>
    </div>
  );
};

export default ChartsSection;

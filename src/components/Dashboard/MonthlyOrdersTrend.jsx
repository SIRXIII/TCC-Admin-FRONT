import React from "react";

const MonthlyOrdersTrend = () => {
  const ordersData = [5, 10, 15, 18, 22, 18, 14, 17, 20, 16, 23, 21, 24];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yAxisValues = [25, 20, 15, 10, 5];
  const chartHeight = 314;
  const chartWidth = 1018;
  const lineHeight = 109;

  const maxValue = Math.max(...ordersData);
  const leftPadding = 24;
  const usableWidth = chartWidth - leftPadding;
  const paddingX = usableWidth / (ordersData.length - 1);

  const points = ordersData.map((val, i) => {
    const x = leftPadding + i * paddingX;
    const y = 85 + (lineHeight - (val / maxValue) * lineHeight);
    return `${x},${y}`;
  });

  return (
    <div className="bg-white rounded-lg border-color p-6 gap-6">
      <h2 className="text-xl font-roboto fw4 text-[#232323] leading-[150%] tracking-[-0.04em] mb-4">
        Monthly Orders Trend
      </h2>

      <div className="flex gap-3 py-6">
        <div className="flex flex-col justify-between h-[314px] relative">
          {yAxisValues.map((value, index) => (
            <div key={index} className="flex justify-end items-center">
              <span className="text-xs text-[#4B5563]">{value}</span>
            </div>
          ))}
        </div>

        <div className="relative border-l border-b border-[#D5D7DA] w-[1018px] h-[314px]">
          <svg
            className="w-[1018px] h-[314px]"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#F77F00"
              strokeWidth="2"
              points={points.join(" ")}
            />
          </svg>

          <div className="absolute -bottom-6 left-0 flex justify-between w-[1018px] h-[21px] fw4 text-sm leading-[150%] tracking-[-0.03em] text-center text-[#4B5563]">
            {months.map((month, index) => (
              <div key={index} className="flex-1 text-center">
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOrdersTrend;

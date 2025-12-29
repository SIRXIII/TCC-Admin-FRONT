// import React from "react";

// const MonthlyOrdersTrend = () => {
//   const ordersData = [5, 10, 15, 18, 22, 18, 14, 17, 20, 16, 23, 21, 24];
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const yAxisValues = [25, 20, 15, 10, 5];
//   const chartHeight = 314;
//   const chartWidth = 1000; // Full width for better visibility
//   const lineHeight = 109;

//   const maxValue = Math.max(...ordersData);
//   const leftPadding = 24;
//   const usableWidth = chartWidth - leftPadding;
//   const paddingX = usableWidth / (ordersData.length - 1);

//   const points = ordersData.map((val, i) => {
//     const x = leftPadding + i * paddingX;
//     const y = 85 + (lineHeight - (val / maxValue) * lineHeight);
//     return `${x},${y}`;
//   });

//   return (
//     <div className="bg-white rounded-lg border-color p-6 gap-6">
//       <h2 className="text-xl font-roboto fw4 text-[#232323] leading-[150%] tracking-[-0.04em] mb-4">
//         Monthly Orders Trend
//       </h2>

//       <div className="flex gap-3 py-6">
//         <div className="flex flex-col justify-between h-[314px] relative">
//           {yAxisValues.map((value, index) => (
//             <div key={index} className="flex justify-end items-center">
//               <span className="text-xs text-[#4B5563]">{value}</span>
//             </div>
//           ))}
//         </div>

//         <div className="relative border-l border-b border-[#D5D7DA] w-full h-[314px]">
//           <svg
//             className="w-full h-[314px]"
//             viewBox={`0 0 ${chartWidth} ${chartHeight}`}
//             preserveAspectRatio="none"
//           >
//             <polyline
//               fill="none"
//               stroke="#F77F00"
//               strokeWidth="2"
//               points={points.join(" ")}
//             />
//           </svg>

//           <div className="absolute -bottom-6 left-0 flex justify-between w-full h-[21px] fw4 text-sm leading-[150%] tracking-[-0.03em] text-center text-[#4B5563]">
//             {months.map((month, index) => (
//               <div key={index} className="flex-1 text-center">
//                 {month}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyOrdersTrend;






import React from "react";

const MonthlyOrdersTrend = () => {
  const ordersData = [5, 10, 15, 18, 22, 18, 14, 17, 20, 16, 23, 21];
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const yAxisValues = [25, 20, 15, 10, 5];

  const chartHeight = 300;
  const chartWidth = 1000;

  const maxValue = Math.max(...ordersData);
  const leftPadding = 40;
  const paddingX = (chartWidth - leftPadding) / (ordersData.length - 1);

  const points = ordersData.map((val, i) => {
    const x = leftPadding + i * paddingX;
    const y = 40 + (200 - (val / maxValue) * 200);
    return `${x},${y}`;
  });

  return (
    <div className="bg-white rounded-lg border-color p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-roboto fw4 text-[#232323] mb-4">
        Monthly Orders Trend
      </h2>

      {/* ================= CHART CONTAINER ================= */}
      {/* Scroll ONLY on small screens */}
      <div className="overflow-x-auto lg:overflow-visible">
        {/* Fixed width only for small screens */}
        <div className="min-w-[900px] lg:min-w-full">
          <div className="flex gap-4 py-6">
            
            {/* Y AXIS */}
            <div className="flex flex-col justify-between h-[300px] pr-2">
              {yAxisValues.map((value, index) => (
                <span
                  key={index}
                  className="text-xs text-[#4B5563]"
                >
                  {value}
                </span>
              ))}
            </div>

            {/* CHART */}
            <div className="relative w-full h-[300px] border-l border-b border-[#D5D7DA]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <polyline
                  fill="none"
                  stroke="#F77F00"
                  strokeWidth="2"
                  points={points.join(" ")}
                />
              </svg>

              {/* X AXIS */}
              <div className="absolute -bottom-6 left-0 flex justify-between w-full text-xs text-[#4B5563]">
                {months.map((month, index) => (
                  <span key={index} className="flex-1 text-center">
                    {month}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOrdersTrend;

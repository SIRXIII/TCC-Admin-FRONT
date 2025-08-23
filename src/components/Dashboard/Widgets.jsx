import React from "react";
import widgetData from '../../data/widgetData.js'; 

const Widgets = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[130px]">
      {widgetData.map((item) => (
        <div
          key={item.id}
          className="p-6 rounded-lg border-color bg-white"
        >
          <h6 className="text-xl leading-[120%] tracking-[-4%] mb-5 text-gray-500 font-roboto gap-[214px]">{item.label}</h6>
          <h2 className="text-2xl fw6 leading-[140%] tracking-[-3%] text-black">{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default Widgets;

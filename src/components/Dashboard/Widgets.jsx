import React from "react";
import { Link } from "react-router-dom";
import { useWidgets } from "../../hooks/useDashboard";

const Widgets = () => {
  const { data: widgetData, isLoading, error } = useWidgets();

  if (isLoading) return <p>Loading States...</p>;
  if (error) return <p>Error loading States</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {widgetData.map((item) => {
        const linkConfigs = {
          "Active Partners": { path: "/partners" },
          "Pending Orders": { path: "/orders", state: { activeTab: "pending" } },
          "Active Riders": { path: "/riders" },
        };

        const linkConfig = linkConfigs[item.label];

        const WidgetContent = (
          <div className="p-6 rounded-lg border-color bg-white">
            <h6 className="text-xl leading-[120%] tracking-[-4%] mb-5 text-gray-500 font-roboto gap-[214px]">
              {item.label}
            </h6>
            <h2
              className={`text-2xl fw6 leading-[140%] tracking-[-3%] text-black ${
                linkConfig ? "group-hover:underline" : ""
              }`}
            >
              {item.value}
            </h2>
          </div>
        );

        return linkConfig ? (
          <Link
            key={item.label}
            to={linkConfig.path}
            state={linkConfig.state || {}}
            className="group" 
          >
            {WidgetContent}
          </Link>
        ) : (
          <div key={item.label}>{WidgetContent}</div>
        );
      })}
    </div>
  );
};

export default Widgets;
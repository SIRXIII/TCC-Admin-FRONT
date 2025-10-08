// StoreAvailabilityCard.jsx
import React from "react";

const StoreAvailabilityCard = ({ availability, handleCheckboxChange, handleTimeChange }) => {
  const days = Object.keys(availability);

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Availability</h3>

      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 last:border-none"
          >
            <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={availability[day].checked}
                onChange={() => handleCheckboxChange(day)}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-400 cursor-pointer"
              />
              {day}
            </label>

            {availability[day].checked && (
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <input
                  type="time"
                  value={availability[day].start_time}
                  onChange={(e) => handleTimeChange(day, "start_time", e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <span className="text-gray-500 text-sm">to</span>
                <input
                  type="time"
                  value={availability[day].end_time}
                  onChange={(e) => handleTimeChange(day, "end_time", e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreAvailabilityCard;

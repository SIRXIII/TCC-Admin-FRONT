// StoreAvailabilityCard.jsx
import React from "react";
import CustomTimePicker from "./CustomTimePicker";

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
                <CustomTimePicker
                  value={availability[day].start_time}
                  onChange={(newTime) => handleTimeChange(day, "start_time", newTime)}
                />
                <span className="text-gray-500 text-sm">to</span>
                <CustomTimePicker
                  value={availability[day].end_time}
                  onChange={(newTime) => handleTimeChange(day, "end_time", newTime)}
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

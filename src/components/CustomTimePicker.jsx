import React, { useState } from 'react';

const CustomTimePicker = ({ onChange, value, format = 'hh:mm a', disabled = false }) => {
  
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
 
 const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
 
  const periods = ['AM', 'PM'];

  const [time, setTime] = useState(() => {
    if (!value) return { hour: '09', minute: '00', period: 'AM' };
    const [timePart, period] = value.split(' ');
    const [hour, minute] = timePart.split(':');
    return { hour, minute, period };
  });

  const handleChange = (field, newValue) => {
    const newTime = { ...time, [field]: newValue };
    setTime(newTime);
    
    const formattedTime = `${newTime.hour}:${newTime.minute} ${newTime.period}`;
    onChange(formattedTime);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={time.hour}
        onChange={(e) => handleChange('hour', e.target.value)}
        disabled={disabled}
        className="p-2 text-sm text-[#121212] bg-transparent border border-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="text-[#121212]">:</span>
      <select
        value={time.minute}
        onChange={(e) => handleChange('minute', e.target.value)}
        disabled={disabled}
        className="p-2 text-sm text-[#121212] bg-transparent border border-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
      <select
        value={time.period}
        onChange={(e) => handleChange('period', e.target.value)}
        disabled={disabled}
        className="p-2 text-sm text-[#121212] bg-transparent border border-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {periods.map((period) => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomTimePicker;
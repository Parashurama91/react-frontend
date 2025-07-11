import React, { useState } from 'react'; 
import { HardDrive } from 'lucide-react'; 
import { useNavigate ,useParams} from 'react-router-dom';

export const DiskUsageCard = ({ diskMap,isDarkMode}) => {
  const {id}=useParams()
  const radius = 50;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const diskNames = Object.keys(diskMap);
  const [selectedDisk, setSelectedDisk] = useState(diskNames[0]);

  const diskData = diskMap[selectedDisk];
  const total = diskData.reduce((acc, item) => acc + item.value, 0);

  let offset = 0;
  const segments = diskData.map((item) => {
    const percent = item.value / total;
    const dash = percent * circumference;
    const segment = (
      <circle
        key={item.name}
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
      />
    );
    offset += dash;
    return segment;
  });
   const navigate = useNavigate();
      const handleCardClick = () => {
        navigate(`/devices/${id}/disk_details`);
      };
      const stopPropagation = (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the card
      };
  return (
    <div onClick={handleCardClick} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 h-60 w-75 flex flex-col justify-between`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <HardDrive className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Disk Usage
          </span>
        </div>
        <select
          value={selectedDisk}
          onChange={(e) => setSelectedDisk(e.target.value)}
          onClick={stopPropagation}
          className={`text-xs px-2 py-1 border rounded cursor-pointer appearance-none pr-4
            ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
        >
          {diskNames.map((disk) => (
            <option key={disk} value={disk}>{disk}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div onClick={stopPropagation} className="flex items-center justify-center my-2">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={isDarkMode ? '#374151' : '#E5E7EB'}
              strokeWidth="12"
            />
            {segments}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {total} GB
            </span>
          </div>
        </div>
      </div>

      {/* Legend + View Details */}
      <div className="flex justify-between items-end mt-2 text-xs">
        <div className="space-y-1">
          {diskData.map((entry) => (
            <div className="flex items-center" key={entry.name}>
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {entry.name} {entry.value} GB
              </span>
            </div>
          ))}
        </div>
        <div>
           <button className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
             onClick={handleCardClick}>
          View details
        </button>
        </div>
      </div>
    </div>
  );
};

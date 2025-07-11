import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MemoryStick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export const MemoryCard = ({ isDarkMode,memoryData }) => {
  const {id} = useParams()
  const navigate = useNavigate();
   const handleCardClick = () => {
        navigate(`/devices/${id}/memory_details`);
      };

      const stopPropagation = (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the card
      };
  return (
    <div onClick={handleCardClick} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 w-75 h-60 flex flex-col justify-between`}>
      
      {/* Title */}
      <div>
        <div className="flex items-center mb-2">
          <MemoryStick className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Memory Usage</span>
        </div>

        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>100%</span>
      </div>
      {/* Chart */}
      <div className="h-28" onClick={stopPropagation}>
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={memoryData}>
        <XAxis dataKey="name"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 10, dy: 19.5 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(tick) => `${tick}`}
            /> 
        <YAxis hide />
            <Tooltip
                contentStyle={{
                padding: '2px 6px',
                fontSize: '11px',
                backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', // dark or light
                borderRadius: '4px',
                border: '1px solid #ccc',
            }}
            itemStyle={{ margin: 0 }}
            labelStyle={{ display: 'none' }} // optional: hides the x-axis label
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value) => [`${value}%`, 'Usage']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fill="#93C5FD"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
        </AreaChart>
        </ResponsiveContainer>
        </div>
      {/* Bottom-right button */}
      <div className="flex justify-end mt-2">
        <button className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer" onClick={handleCardClick}>
          View details
        </button>
      </div>
    </div>
  );
};
import {useState} from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Network } from 'lucide-react';
import { useNavigate,useParams } from 'react-router-dom';

export const NetworkCard = ({ networkMap, isDarkMode }) => {
  const [selectedInterface, setSelectedInterface] = useState('eth0');
  const networkData = networkMap[selectedInterface] || [];
  const navigate = useNavigate();
  const {id} = useParams()
  console.log("device",id)
  const handleCardClick = () => {
         navigate(`/devices/${id}/network_details`);
      };
      
      const stopPropagation = (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the card
      };
  return (
    <div onClick={handleCardClick} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 h-60 w-75 flex flex-col justify-between`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Network className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Network Traffic
          </span>
        </div>

        {/* Dropdown for selecting interface */}
        <select
          value={selectedInterface}
          onChange={(e) => setSelectedInterface(e.target.value)}
          onClick={stopPropagation}
          className={ `text-xs px-2 py-1 border rounded cursor-pointer appearance-none pr-4
            ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
        >
          {Object.keys(networkMap).map((iface) => (
            <option key={iface} value={iface}>
              {iface}
            </option>
          ))}
        </select>
      </div>

      {/* Speed Info */}
      <div className="mt-2 mb-1">
        <span onClick={stopPropagation} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>100%</span>
      </div>

      {/* Line Chart */}
      <div className="h-28 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={networkData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, dy: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                padding: '2px 6px',
                fontSize: '11px',
                backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              itemStyle={{ margin: 0 }}
              labelStyle={{ display: 'none' }}
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value) => [`${value}%`, 'Usage']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* View details */}
      <div className="flex justify-end -mt-1">
        <button className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
       onClick={handleCardClick}>
          View details
        </button>
      </div>
    </div>
  );
};
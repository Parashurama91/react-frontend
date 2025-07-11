import { Cpu } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate,useParams} from 'react-router-dom';

export const CPUCard = ({ isDarkMode ,cpuData}) => {
      const navigate = useNavigate();
      const {id} = useParams()
      const handleCardClick = () => {
        navigate(`/devices/${id}/cpu_details`);
      };
 
      const stopPropagation = (e) => {
        e.stopPropagation();
      };
  return (
    < div onClick={handleCardClick} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 h-60 w-75 flex flex-col justify-between 
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Cpu className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            CPU Usage
          </span>
        </div>
      </div>
 
      {/* Static usage display */}
      <div className="mb-2">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>100%</span>
      </div>
 
      {/* Bar Chart */}
      <div className="h-32" onClick={stopPropagation}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cpuData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
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
            <Bar dataKey="value" fill="#3B82F6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end -mt-1 -mb-0.1">
        <button className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
        onClick={handleCardClick}>
          View details
        </button>
      </div>
    </div>
  );
};
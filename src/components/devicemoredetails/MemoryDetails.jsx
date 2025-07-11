import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { useState } from 'react';
import { HardDrive, Monitor, BarChart3, TrendingUp, Activity, MemoryStick } from 'lucide-react';

const hourlyData = [
  { name: '1 AM', value: 45 },
  { name: '2 AM', value: 38 },
  { name: '3 AM', value: 52 },
  { name: '4 AM', value: 67 },
  { name: '5 AM', value: 78 },
  { name: '6 AM', value: 85 },
];

const dailyData = [
  { name: 'Mon', value: 62 },
  { name: 'Tue', value: 58 },
  { name: 'Wed', value: 73 },
  { name: 'Thu', value: 69 },
  { name: 'Fri', value: 81 },
  { name: 'Sat', value: 76 },
  { name: 'Sun', value: 68 },
];

const weeklyData = [
  { name: 'Week 1', value: 65 },
  { name: 'Week 2', value: 72 },
  { name: 'Week 3', value: 58 },
  { name: 'Week 4', value: 83 },
  { name: 'Week 5', value: 77 },
  { name: 'Week 6', value: 69 },
];

const monthlyData = [
  { name: 'Jan', value: 68 },
  { name: 'Feb', value: 75 },
  { name: 'Mar', value: 62 },
  { name: 'Apr', value: 79 },
  { name: 'May', value: 84 },
  { name: 'Jun', value: 71 },
  { name: 'Jul', value: 88 },
  { name: 'Aug', value: 66 },
  { name: 'Sep', value: 73 },
  { name: 'Oct', value: 81 },
  { name: 'Nov', value: 69 },
  { name: 'Dec', value: 77 },
];

// import { useOutletContext } from 'react-router-dom';

export const MemoryDetails = ({isDarkMode}) => {
  const used = 4.13;
  const free = 2.62;
  const total = 7.75;

  const usedPercent = ((used / total) * 100).toFixed(0);
  const freePercent = ((free / total) * 100).toFixed(0);
  const [currentTime] = useState(new Date());
  const [selectedGraphType, setSelectedGraphType] = useState('bar');
//   const { isDarkMode } = useOutletContext();
  const memoryInfo = '32 GB DDR4-3200 MHz'; // Memory specification
  
  const cardClass = `rounded-lg shadow-md p-4 h-60 ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  const graphTypes = [
    { id: 'bar', label: 'Bar', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'area', label: 'Area', icon: Activity }
  ];

  const renderChart = (data, color) => {
    const commonProps = {
      data,
      width: "100%",
      height: "100%"
    };

    const tooltipProps = {
      contentStyle: {
        padding: '2px 6px',
        fontSize: '11px',
        backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
        borderRadius: '4px',
        border: '1px solid #ccc',
      },
      itemStyle: { margin: 0 },
      labelStyle: { display: 'none' },
      labelFormatter: (label) => `Time: ${label}`,
      formatter: (value) => [`${value}%`, 'Usage']
    };

    switch (selectedGraphType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip {...tooltipProps} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip {...tooltipProps} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      default: // bar
        return (
          <BarChart {...commonProps}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sticky">
        <div className={`rounded-lg shadow-md p-4 h-20 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {/* Icon + Text Group */}
          <div className="flex items-center space-x-4">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-500">
                <Monitor className="w-6 h-6 text-white"/>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>192.168.100.51</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Windows 6.2.9200</p>
              </div>
            </div>
          </div>
          
          {/* Graph Type Selection */}
          <div className="flex items-center space-x-2">
            {graphTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedGraphType(type.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedGraphType === type.id
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 1: System Info */}
      <div className="grid grid-cols-1">
        <div className={`rounded-lg shadow-md p-4 h-20 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {/* Icon + Text Group */}
          <div className="flex items-center space-x-4">
            {/* Memory Icon */}
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <MemoryStick className="w-4 h-4 text-white" />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg font-semibold">Memory Performance Analytics</h3>
              <p className="text-sm text-gray-500">{memoryInfo}</p>
            </div>
          </div>

          {/* Time */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {currentTime.toLocaleString()}
          </div>  
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hourly Chart */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Hourly Memory Utilization</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(hourlyData, '#8B5CF6')}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Chart */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Daily Memory Utilization</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(dailyData, '#06B6D4')}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Weekly and Monthly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Weekly Memory Utilization</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(weeklyData, '#F97316')}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Monthly Memory Utilization</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(monthlyData, '#EF4444')}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sticky">
      <div
        className={`rounded-lg  shadow-md w-238 p-4 h-24 flex flex-col justify-between ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }` }
       >
        {/* Title */}
        <div className="text-sm font-medium mb-1">RAM</div>

        {/* Usage Bar */}
        <div className="relative h-4 wrounded overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div
            className="absolute top-0 left-0 h-full bg-orange-400"
            style={{ width: `${usedPercent}%` }}
          />
          <div
            className="absolute top-0  h-full "
            style={{ width: '0.5%' }}
          />
          <span className="absolute left-2 text-xs text-white font-semibold">
            {usedPercent}%
          </span>
          <span className="absolute right-2 text-xs text-gray-500 font-semibold">
            {freePercent}%
          </span>
        </div>

        {/* RAM Stats */}
        <div className="flex justify-between text-xs mt-2">
          <div className="text-orange-300">
            <span className="font-semibold">Used:</span> {used}GB ({usedPercent}%)
          </div>
          <div className="text-gray-400">
            <span className="font-semibold">Free:</span> {free}GB ({freePercent}%)
          </div>
          <div >
            <span className="font-semibold">Total:</span> {total}GB
          </div>
        </div>
      </div>
    </div>
      </div>
    
  );
};
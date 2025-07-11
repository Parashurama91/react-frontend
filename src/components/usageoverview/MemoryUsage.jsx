import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import {  Donut,PieChart as  PieIcon,Monitor,MemoryStick } from 'lucide-react';

const generateRandomMemoryUsage = () => {
  const totalMemory = 16384; // 16GB in MB
  const usedMemory = Math.floor(Math.random() * 12288) + 2048; // 2GB to 14GB used
  const freeMemory = totalMemory - usedMemory;
  return { total: totalMemory, used: usedMemory, free: freeMemory };
};

const formatMemorySize = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb} MB`;
};

export const MemoryUsageCard = ({ isDarkMode = false }) => {
  const [selectedGraph, setSelectedGraph] = useState('donut');
  const [memoryMap, setMemoryMap] = useState({
    'System Memory': [],
    'Physical Memory': [],
    'Virtual Memory': [],
  });

  const chartOptions = [
    { id: 'donut', label: 'Donut', icon: Donut },
    { id: 'pie', label: 'Pie', icon: PieIcon  },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryMap(prevMap => {
        const newMap = {};
        const now = new Date();
        const timeLabel = `${now.getMinutes()}m:${now.getSeconds()}s`;

        Object.entries(prevMap).forEach(([memoryType, data]) => {
          const memoryData = generateRandomMemoryUsage();
          const newData = [...data, { 
            name: timeLabel, 
            ...memoryData,
            timestamp: now.getTime()
          }];
          if (newData.length > 10) newData.shift();
          newMap[memoryType] = newData;
        });

        return newMap;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

 

  return (
    <div className="space-y-4">
      {/* Device Header with Graph Selector */}
      <div className={`rounded-lg shadow-md p-4 h-20 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">192.168.100.51</h3>
            <p className="text-sm text-gray-500">Windows 6.2.9200</p>
          </div>
        </div>

        {/* Graph Type Toggle */}
        <div className="flex items-center space-x-2">
          {chartOptions.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedGraph(type.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedGraph === type.id
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

      {/* Memory Usage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(memoryMap).map(([label, memoryData]) => {
          const latestData = memoryData[memoryData.length - 1] || { total: 16384, used: 8192, free: 8192 };
          const usagePercentage = Math.round((latestData.used / latestData.total) * 100);
          
          const chartData = [
            { name: 'Used', value: latestData.used, color: '#3B82F6', percentage: usagePercentage },
            { name: 'Free', value: latestData.free, color: '#E5E7EB', percentage: 100 - usagePercentage }
          ];

          const renderChart = () => {
            return (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    innerRadius={selectedGraph === 'donut' ? 45 : 0}
                    paddingAngle={2}
                    isAnimationActive={false}
                    activeShape={null}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                  labelStyle={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '12px',
                  }}
                  itemStyle={{
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '12px',
                    }}
                  formatter={(value, name) => [formatMemorySize(value), name]}
                />
                </PieChart>
              </ResponsiveContainer>
            );
          };

          return (
            <div key={label} className={`rounded-lg shadow-md p-4 flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              {/* Memory Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-semibold">{label}</h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-sm font-medium">{formatMemorySize(latestData.total)}</div>
                </div>
              </div>

              {/* Memory Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`p-2 rounded ${isDarkMode ? 'bg-blue-50' : 'bg-blue-50'}`}>
                  <div className="text-xs text-gray-500">Used</div>
                  <div className="text-sm font-medium text-blue-600">{formatMemorySize(latestData.used)}</div>
                  <div className="text-xs text-gray-500">{usagePercentage}%</div>
                </div>
                <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-50' : 'bg-gray-50'}`}>
                  <div className="text-xs text-gray-500">Free</div>
                  <div className="text-sm font-medium text-gray-600">{formatMemorySize(latestData.free)}</div>
                  <div className="text-xs text-gray-500">{100 - usagePercentage}%</div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {renderChart()}
              </div>

              {/* Legend for pie/donut charts */}
              <div className="flex items-center  space-x-4 text-xs -mt-4 ml-19">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  <span>Used ({usagePercentage}%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-300"></div>
                  <span>Free ({100 - usagePercentage}%)</span>
                </div>
              </div>

              {/* Memory Status Indicator */}
              <div className={`mt-3 px-3 py-1 rounded-md text-xs font-medium text-center ${
                usagePercentage > 85 
                  ? 'bg-red-100 text-red-800' 
                  : usagePercentage > 70 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {usagePercentage > 85 ? 'High Usage' : usagePercentage > 70 ? 'Moderate Usage' : 'Normal Usage'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


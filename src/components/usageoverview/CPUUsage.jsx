import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Cpu, Donut, PieChart as PieIcon, Monitor } from 'lucide-react';

const generateRandomUsage = () => Math.floor(Math.random() * 81) + 10;

export const CPUUsageCard = ({ isDarkMode = false }) => {
  const [selectedGraph, setSelectedGraph] = useState('donut');
  const [cpuMap, setCpuMap] = useState({
    'AMD Ryzen 9 5950X 16-Core Processor': [],
    'AMD Ryzen 9 5950X 12-Core Processor': [],
  });

  const chartOptions = [
    { id: 'donut', label: 'Donut', icon: Donut },
    { id: 'pie', label: 'Pie', icon: PieIcon },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuMap(prevMap => {
        const newMap = {};
        const now = new Date();
        const timeLabel = `${now.getMinutes()}m:${now.getSeconds()}s`;

        Object.entries(prevMap).forEach(([cpu, data]) => {
          const newVal = generateRandomUsage();
          const newData = [...data, { name: timeLabel, value: newVal }];
          if (newData.length > 10) newData.shift();
          newMap[cpu] = newData;
        });

        return newMap;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '12px',
    
    },
    itemStyle:{
         color: isDarkMode ? '#ffffff' : '#000000',
         fontSize: '12px',
    }
  };

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

      {/* CPU Usage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(cpuMap).map(([label, cpuData]) => {
          const latestUsage = cpuData[cpuData.length - 1]?.value || 0;
          const chartData = [
            { name: 'Used ', value: latestUsage, color: '#3B82F6' },
            { name: 'Free ', value: 100 - latestUsage, color: '#E5E7EB' }
          ];
          
          const renderChart = () => (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={selectedGraph === 'donut' ? 50 : 0}
                  paddingAngle={2}
                  isAnimationActive={false}
                  activeShape={null}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} 
                formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          );

          return (
            <div key={label} className={`rounded-lg shadow-md p-4 h-69 flex flex-col justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              {/* CPU Header */}
              <div className="flex items-center space-x-2 mb-1">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-semibold">{label}</h4>
              </div>

              {/* Chart and Legend */}
              <div className="flex-1 mt-2 flex flex-col items-start justify-center">
                <div className="w-full">
                  {renderChart()}
                </div>
                <div className="flex items-center  space-x-4 text-xs -mt-4 ml-19">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                    <span>Used({latestUsage}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-300"></div>
                    <span>Free({100 - latestUsage}%)</span>
                  </div>
                </div>
                <div className={`mt-3 w-full px-3 py-1 rounded-md text-xs font-medium text-center ${
                  latestUsage > 85 
                    ? 'bg-red-100 text-red-800' 
                    : latestUsage > 70 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                  }`}>
                    {latestUsage > 85 ? 'High Usage' : latestUsage > 70 ? 'Moderate Usage' : 'Normal Usage'}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

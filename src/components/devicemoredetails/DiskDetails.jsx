import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { useState } from 'react';
import { Cpu, Monitor, BarChart3, TrendingUp, Activity, HardDrive } from 'lucide-react';

const partitions = [
  {
    mountpoint: 'C',
    total: 100,
    used: 70,
    free: 30,
    usedPercent: 70,
    freePercent: 30
  },
  {
    mountpoint: 'D',
    total: 200,
    used: 130,
    free: 70,
    usedPercent: 65,
    freePercent: 35
  },
  {
    mountpoint: 'E',
    total: 50,
    used: 45,
    free: 5,
    usedPercent: 90,
    freePercent: 10
  }
];

const hourlyData = [
  { name: '1 AM', value: 30 },
  { name: '2 AM', value: 40 },
  { name: '3 AM', value: 65 },
  { name: '4 AM', value: 50 },
  { name: '5 AM', value: 75 },
  { name: '6 AM', value: 90 },
];

const dailyData = [
  { name: 'Mon', value: 55 },
  { name: 'Tue', value: 70 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 80 },
  { name: 'Fri', value: 60 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 85 },
];

const weeklyData = [
  { name: 'Week 1', value: 70 },
  { name: 'Week 2', value: 65 },
  { name: 'Week 3', value: 80 },
  { name: 'Week 4', value: 75 },
  { name: 'Week 5', value: 90 },
  { name: 'Week 6', value: 70 },
];

const monthlyData = [
  { name: 'Jan', value: 60 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 75 },
  { name: 'Jun', value: 80 },
  { name: 'Jul', value: 95 },
  { name: 'Aug', value: 70 },
  { name: 'Sep', value: 85 },
  { name: 'Oct', value: 90 },
  { name: 'Nov', value: 80 },
  { name: 'Dec', value: 75 },
];

export const  DiskDetails = ({isDarkMode}) => {
// Simulating dark mode state
  const [currentTime] = useState(new Date());
  const [selectedGraphType, setSelectedGraphType] = useState('bar');

  const processor = 'DISK-0'; // Simulating processor param
  
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
    <div className=" space-y-4">
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
            {/* CPU Icon */}
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-white" />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg font-semibold">StorageDisk Performance Analytics</h3>
              <p className="text-sm text-gray-500">{processor}</p>
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
          <h4 className="text-md font-semibold mb-2">Hourly Disk Usage</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(hourlyData, '#3B82F6')}
            </ResponsiveContainer> 
          </div>
        </div>

        {/* Daily Chart */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Daily Disk Usage</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(dailyData, '#10B981')}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Weekly and Monthly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Weekly Disk Usage</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(weeklyData, '#F59E0B')}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Monthly Disk Usage</h4>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(monthlyData, '#EF4441')}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partitions.map((partition, index) => (
            <div
            key={index}
            className={`rounded-lg shadow-md p-4 flex flex-col justify-between ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            >
            {/* Title */}
            <div className="text-sm font-semibold mb-1">
                Mountpoint: {partition.mountpoint}
            </div>

            {/* Usage Bar */}
            <div className="relative h-5 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
                <div
                className="absolute top-0 left-0 h-full bg-orange-400"
                style={{ width: `${partition.usedPercent}%` }}
                />
                <div
                className="absolute top-0 h-full bg-orange-700"
                style={{ left: `${partition.usedPercent}%`, width: `${partition.freePercent}%` }}
                />
                <span className="absolute left-2 text-xs text-white font-semibold">
                {partition.usedPercent}%
                </span>
                <span className="absolute right-2 text-xs text-white font-semibold">
                {partition.freePercent}%
                </span>
            </div>

            {/* Disk Stats */}
            <div className="flex justify-between text-xs">
                <div className="text-orange-400 font-medium">
                <span className="font-semibold">Used:</span> {partition.used}GB ({partition.usedPercent}%)
                </div>
                <div className="text-gray-400">
                <span className="font-semibold">Free:</span> {partition.free}GB ({partition.freePercent}%)
                </div>
                <div className="text-black dark:text-white font-semibold">
                Total: {partition.total}GB
                </div>
            </div>
            </div>
        ))}
        </div>

      </div>

  );
};
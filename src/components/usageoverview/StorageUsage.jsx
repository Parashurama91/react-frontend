import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Donut, PieChart as LucidePieChart, Monitor, HardDrive } from 'lucide-react';

const generateRandomDiskUsage = () => {
  const totalDisk = 1024 * 1024; // 1TB in MB
  const usedDisk = Math.floor(Math.random() * 819200) + 204800;
  const freeDisk = totalDisk - usedDisk;

  const partitions = [
    {
      mountpoint: 'C',
      total: 300,
      used: 200,
      free: 100,
      usedPercent: 66,
      freePercent: 34
    },
    {
      mountpoint: 'D',
      total: 200,
      used: 130,
      free: 70,
      usedPercent: 65,
      freePercent: 35
    }
  ];

  return { total: totalDisk, used: usedDisk, free: freeDisk, partitions };
};

const formatDiskSize = (mb) => {
  if (mb >= 1024 * 1024) return `${(mb / (1024 * 1024)).toFixed(1)} TB`;
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
};

export const DiskUsageCard = ({ isDarkMode = false }) => {
  const [selectedGraph, setSelectedGraph] = useState('donut');
  const [diskMap, setDiskMap] = useState({
    'PhysicalDrive0': [],
    'PhysicalDrive1': [],
    'PhysicalDrive2': [],
  });

  const chartOptions = [
    { id: 'donut', label: 'Donut', icon: Donut },
    { id: 'pie', label: 'Pie', icon: LucidePieChart },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDiskMap(prevMap => {
        const newMap = {};
        const now = new Date();
        const timeLabel = `${now.getMinutes()}m:${now.getSeconds()}s`;

        Object.entries(prevMap).forEach(([diskType, data]) => {
          const diskData = generateRandomDiskUsage();
          const newData = [...data, {
            name: timeLabel,
            ...diskData,
            timestamp: now.getTime()
          }];
          if (newData.length > 10) newData.shift();
          newMap[diskType] = newData;
        });

        return newMap;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
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

        <div className="flex items-center space-x-2">
          {chartOptions.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedGraph(type.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedGraph === type.id
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

      {/* Disk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(diskMap).map(([label, diskData]) => {
          const latestData = diskData[diskData.length - 1] || { total: 1024 * 1024, used: 512 * 1024, free: 512 * 1024, partitions: [] };
          const usagePercentage = Math.round((latestData.used / latestData.total) * 100);

          const chartData = [
            { name: 'Used', value: latestData.used, color: '#3B82F6' },
            { name: 'Free', value: latestData.free, color: '#E5E7EB' }
          ];

          return (
            <div key={label} className={`rounded-lg shadow-md p-4 flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              {/* Disk Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-semibold">{label}</h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-sm font-medium">{formatDiskSize(latestData.total)}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded bg-blue-50">
                  <div className="text-xs text-gray-500">Used</div>
                  <div className="text-sm font-medium text-blue-600">{formatDiskSize(latestData.used)}</div>
                  <div className="text-xs text-gray-500">{usagePercentage}%</div>
                </div>
                <div className="p-2 rounded bg-gray-50">
                  <div className="text-xs text-gray-500">Free</div>
                  <div className="text-sm font-medium text-gray-600">{formatDiskSize(latestData.free)}</div>
                  <div className="text-xs text-gray-500">{100 - usagePercentage}%</div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={70}
                      innerRadius={selectedGraph === 'donut' ? 45 : 0}
                      paddingAngle={2}
                      className="focus:outline-none"
                      isAnimationActive={false}
                      activeShape={null}
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      isAnimationActive={false}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const { name, value } = payload[0];
                        const percent = Math.round((value / latestData.total) * 100);
                        return (
                          <div className="px-2 py-1 rounded text-xs shadow-md" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#F9FAFB' : '#111827', border: '1px solid #ccc' }}>
                            <div>{name}: {percent}%</div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex items-center  space-x-4 text-xs -mt-4 ml-19">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span>Used ({usagePercentage}%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-300" />
                  <span>Free ({100 - usagePercentage}%)</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`mt-3 px-3 py-1 rounded-md text-xs font-medium text-center ${usagePercentage > 90
                ? 'bg-red-100 text-red-800'
                : usagePercentage > 80
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
                }`}>
                {usagePercentage > 90 ? 'Critical Space' : usagePercentage > 80 ? 'Low Space' : 'Normal Space'}
              </div>

              {/* Partitions */}
              {latestData.partitions?.length > 0 && (
                <div className="mt-4 space-y-3">
                  {latestData.partitions.map((partition, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-semibold mb-1">Mountpoint: {partition.mountpoint}</div>
                      <div className="relative h-4 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 mb-1">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{ width: `${partition.usedPercent}%` }}
                        />
                        <div
                          className="absolute top-0 h-full bg-gray-300"
                          style={{ left: `${partition.usedPercent}%`, width: `${partition.freePercent}%` }}
                        />
                        <span className="absolute left-2 text-[10px] text-white font-semibold">
                          {partition.usedPercent}%
                        </span>
                        <span className="absolute right-2 text-[10px] text-white font-semibold">
                          {partition.freePercent}%
                        </span>
                      </div>
                      <div className={`flex justify-between text-[11px] text-gray-600 dark:text-white  ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div><strong>Used:</strong> {partition.used}GB</div>
                        <div><strong>Free:</strong> {partition.free}GB</div>
                        <div><strong>Total:</strong> {partition.total}GB</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiskUsageCard;

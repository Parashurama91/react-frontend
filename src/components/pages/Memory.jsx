import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate} from 'react-router-dom';

const MemoryHealth = ({ isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState([]);
  const navigate = useNavigate();
  const MemoryHealthData = [
    { id: 1, device: '192.168.100.51', memory: 'Available memory', used: '3.2GB', total: '32.9GB', usage: 10, trend: 'up', trendValue: 2.3 },
    { id: 2, device: '192.168.100.53', memory: 'Available memory', used: '0B', total: '5.28GB', usage: 0, trend: 'stable', trendValue: 0 },
    { id: 3, device: '192.168.100.54', memory: 'Available memory', used: '0B', total: '2.23GB', usage: 0, trend: 'stable', trendValue: 0 },
    { id: 4, device: '192.168.100.52', memory: 'Available memory', used: '0B', total: '6.15GB', usage: 0, trend: 'down', trendValue: -1.2 },
    { id: 5, device: '192.168.100.51', memory: 'Memory buffers', used: '130MB', total: '7.75GB', usage: 2, trend: 'up', trendValue: 0.5 },
    { id: 6, device: '192.168.100.51', memory: 'Memory buffers', used: '3.22MB', total: '126GB', usage: 0, trend: 'stable', trendValue: 0 },
    { id: 7, device: '192.168.100.51', memory: 'Memory buffers', used: '156MB', total: '7.76GB', usage: 2, trend: 'up', trendValue: 0.8 },
    { id: 8, device: '192.168.100.51', memory: 'Memory buffers', used: '174MB', total: '7.76GB', usage: 2, trend: 'down', trendValue: -0.3 },
    { id: 9, device: '192.168.100.52', memory: 'Physical Memory', used: '1.2GB', total: '7.75GB', usage: 16, trend: 'up', trendValue: 3.2 },
    { id: 10, device: '192.168.100.53', memory: 'Physical Memory', used: '2.19GB', total: '7.76GB', usage: 28, trend: 'up', trendValue: 5.1 },
    { id: 11, device: '192.168.100.51', memory: 'Physical Memory', used: '5.25GB', total: '7.76GB', usage: 68, trend: 'up', trendValue: 12.7 },
    { id: 12, device: '192.168.100.54', memory: 'Physical Memory', used: '37.2GB', total: '126GB', usage: 30, trend: 'down', trendValue: -2.8 },
    { id: 13, device: '192.168.100.52', memory: 'Swap space', used: '967MB', total: '1024MB', usage: 94, trend: 'up', trendValue: 8.9 },
    { id: 14, device: '192.168.100.54', memory: 'Swap space', used: '3.04MB', total: '1.53GB', usage: 0, trend: 'stable', trendValue: 0 }
  ];

  const convertToBytes = (value) => {
    if (value.includes('TB')) return parseFloat(value) * 1024 ** 4;
    if (value.includes('GB')) return parseFloat(value) * 1024 ** 3;
    if (value.includes('MB')) return parseFloat(value) * 1024 ** 2;
    if (value.includes('KB')) return parseFloat(value) * 1024;
    return parseFloat(value);
  };

  const convertBytesToReadable = (bytes) => {
    if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + 'GB';
    if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + 'MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + 'KB';
    return bytes.toFixed(2) + 'B';
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      const existingIndex = prev.findIndex((s) => s.key === key);
      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        return existing.direction === 'asc'
          ? prev.map(s => s.key === key ? { ...s, direction: 'desc' } : s)
          : prev.filter(s => s.key !== key);
      } else {
        return [...prev, { key, direction: 'asc' }];
      }
    });
  };

  const getSortIcon = (key) => {
    const sortEntry = sortConfig.find((s) => s.key === key);
    if (!sortEntry) return null;
    return sortEntry.direction === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1 inline" />
      : <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  const getTrendIcon = (trend, trendValue) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" title={`Increasing by ${trendValue}%`} />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" title={`Decreasing by ${Math.abs(trendValue)}%`} />;
    return <Minus className="w-4 h-4 text-gray-400" title="Stable" />;
  };

  const getUsageColor = (usage) => {
    if (usage <= 10) return 'bg-green-500';
    if (usage <= 30) return 'bg-yellow-500';
    if (usage <= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUsageBarColor = (usage) => {
    if (usage <= 10) return 'bg-green-400';
    if (usage <= 30) return 'bg-yellow-400';
    if (usage <= 70) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const filteredAndSortedData = useMemo(() => {
    let items = MemoryHealthData.map(item => {
      const total = convertToBytes(item.total);
      const used = convertToBytes(item.used);
      const free = Math.max(total - used, 0);
      return { ...item, freeBytes: free, free: convertBytesToReadable(free) };
    });

    items = items.filter(item =>
      item.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.length === 0) return items;

    return items.sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        let aVal = a[key], bVal = b[key];

        if (["used", "total", "free"].includes(key)) {
          aVal = convertToBytes(a[key]);
          bVal = convertToBytes(b[key]);
        }

        if (key === 'trend') {
          const trendOrder = { 'up': 2, 'stable': 1, 'down': 0 };
          aVal = trendOrder[aVal];
          bVal = trendOrder[bVal];
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [searchTerm, sortConfig]);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="rounded-lg shadow-md overflow-visible relative" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
        <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>
            Memory Health ({filteredAndSortedData.length})
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search devices or memory types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-1.5 rounded-md border text-sm shadow-sm w-full focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#1F2937] text-white border-[#374151] placeholder-gray-400 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-400 focus:ring-blue-300'}`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.82 4.82a1 1 0 01-1.42 1.42l-4.82-4.82A6 6 0 012 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[25rem] overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[700px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <thead>
                <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
                  {['device', 'memory', 'used', 'free', 'total', 'usage'].map((key) => {
                    const displayName = {
                      device: 'Device',
                      memory: 'Memory Type',
                      used: 'Used',
                      total: 'Total',
                      free: 'Free',
                      usage: 'Usage'
                    }[key];

                    const isSortable = ['used', 'free', 'total', 'usage'].includes(key);
                    const sortIcon = getSortIcon(key);

                    return (
                      <th key={key} className={`py-2 px-4 ${isSortable ? 'cursor-pointer' : ''}`} onClick={isSortable ? () => toggleSort(key) : undefined}>
                        <div className="flex items-center">
                          {displayName}
                          {isSortable && sortIcon}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((item, index) => (
                  <tr 
                    key={item.id}
                    onClick={() => navigate(`/health/memory/overview`)}
                    className={`cursor-pointer hover:opacity-80 transition-opacity ${isDarkMode ? (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}>
                    <td className="py-2 px-4 flex items-center"><div className="w-1 h-6 bg-cyan-400 rounded-full mr-2"></div>{item.device}</td>
                    <td className="py-2 px-4">{item.memory}</td>
                    <td className="py-2 px-4">{item.used}</td>
                    <td className="py-2 px-4">{item.free}</td>
                    <td className="py-2 px-4">{item.total}</td>
                    <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend, item.trendValue)}
                        <div className="relative w-[100px] h-[8px] rounded-full bg-gray-300 dark:bg-[#374151] overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full ${getUsageBarColor(item.usage)} rounded-full`}
                            style={{ width: `${item.usage}%` }}
                        ></div>
                        </div>
                        <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${getUsageColor(item.usage)} min-w-[36px] text-center`}>
                        {item.usage}%
                        </span>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryHealth;

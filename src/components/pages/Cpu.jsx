// import React, { useState, useMemo } from 'react';
// import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CPUHealth = ({ isDarkMode = true }) => {
//   const [selectedDevice, setSelectedDevice] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState([]);
//   const navigate = useNavigate();

//   const CPUHealthData = [
//     { id: 1, device: 'Ubuntu 22.04 LTS', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 12, trend: 'up', status: 'active' },
//     { id: 2, device: 'Ubuntu 22.04 LTS', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 12, trend: 'up', status: 'active' },
//     { id: 3, device: 'Ubuntu 22.04 LTS', processor: 'Average', usage: 12, trend: 'up', status: 'average' },
//     { id: 4, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
//     { id: 5, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
//     { id: 6, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
//     { id: 7, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
//     { id: 8, device: 'Windows 11 Pro', processor: 'Average', usage: 1, trend: 'stable', status: 'average' },
//     { id: 9, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
//     { id: 10, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
//     { id: 11, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
//     { id: 12, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' }
//   ];

//   const toggleSort = (key) => {
//     if (key === 'device' || key === 'processor') return;
//     setSortConfig((prev) => {
//       const existingIndex = prev.findIndex((s) => s.key === key);
//       if (existingIndex !== -1) {
//         const existing = prev[existingIndex];
//         return existing.direction === 'asc'
//           ? prev.map(s => s.key === key ? { ...s, direction: 'desc' } : s)
//           : prev.filter(s => s.key !== key);
//       } else {
//         return [...prev, { key, direction: 'asc' }];
//       }
//     });
//   };

//   const getSortIcon = (key) => {
//     const sortEntry = sortConfig.find((s) => s.key === key);
//     if (!sortEntry) return null;
//     return sortEntry.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />;
//   };

//   const filteredAndSortedData = useMemo(() => {
//     let items = [...CPUHealthData];
//     if (selectedDevice !== 'All') {
//       items = items.filter(item => item.device === selectedDevice);
//     }
//     items = items.filter(item =>
//       item.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.processor.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     if (sortConfig.length === 0) return items;

//     return items.sort((a, b) => {
//       for (const { key, direction } of sortConfig) {
//         let comparison = 0;
//         if (a[key] < b[key]) comparison = -1;
//         if (a[key] > b[key]) comparison = 1;
//         if (comparison !== 0) return direction === 'asc' ? comparison : -comparison;
//       }
//       return 0;
//     });
//   }, [CPUHealthData, selectedDevice, searchTerm, sortConfig]);

//   const getUsageColor = (usage) => {
//     if (usage <= 5) return 'bg-green-500';
//     if (usage <= 20) return 'bg-yellow-500';
//     if (usage <= 50) return 'bg-orange-500';
//     return 'bg-red-500';
//   };

//   const getUsageBarColor = (usage) => {
//     if (usage <= 5) return 'bg-green-400';
//     if (usage <= 20) return 'bg-yellow-400';
//     if (usage <= 50) return 'bg-orange-400';
//     return 'bg-red-400';
//   };

//   const getTrendIcon = (trend) => {
//     switch (trend) {
//       case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
//       case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
//       default: return <Minus className="w-4 h-4 text-gray-400" />;
//     }
//   };

//   return (
//     <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
//       <div className="rounded-lg shadow-md overflow-visible relative" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
//         <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
//           <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>CPU Health ({filteredAndSortedData.length})</span>
//           <div className="flex items-center gap-4 flex-wrap">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search devices or processors..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={`pl-10 pr-4 py-1.5 rounded-md border text-sm shadow-sm w-full focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#1F2937] text-white border-[#374151] placeholder-gray-400 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-400 focus:ring-blue-300'}`}
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.82 4.82a1 1 0 01-1.42 1.42l-4.82-4.82A6 6 0 012 8z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-h-[25rem] overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
//           <div className="max-w-5xl mx-auto">
//             <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[600px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//               <thead>
//                 <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
//                   {['device', 'processor', 'usage'].map((key) => (
//                     <th key={key} className={`py-2 px-4 ${key === 'usage' ? 'cursor-pointer' : ''}`} onClick={() => toggleSort(key)}>
//                       <div className="flex items-center">
//                         {key.charAt(0).toUpperCase() + key.slice(1)}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAndSortedData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     onClick={() => navigate(`/cpu/${encodeURIComponent(item.processor)}`)}
//                     className={`cursor-pointer hover:opacity-80 transition-opacity ${isDarkMode ? (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}
//                   >
//                     <td className="py-2 px-4 flex items-center">
//                       <div className="w-1 h-6 bg-cyan-400 rounded-full mr-2"></div>
//                       {item.device}
//                     </td>
//                     <td className="py-2 px-4">{item.processor}</td>
//                     <td className="py-2 px-4">
//                       <div className="flex items-center gap-2">
//                         {getTrendIcon(item.trend)}
//                         <div className="relative w-[100px] h-[8px] rounded-full bg-gray-300 dark:bg-[#374151] overflow-hidden">
//                           <div
//                             className={`absolute top-0 left-0 h-full ${getUsageBarColor(item.usage)} rounded-full`}
//                             style={{ width: `${item.usage}%` }}
//                           ></div>
//                         </div>
//                         <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${getUsageColor(item.usage)} min-w-[36px] text-center`}>
//                           {item.usage}%
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CPUHealth;

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CPUHealth = ({ isDarkMode = true }) => {
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState([]);
  const navigate = useNavigate();

  const CPUHealthData = [
    { id: 1, device: 'Ubuntu 22.04 LTS', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 12, trend: 'up', status: 'active' },
    { id: 2, device: 'Ubuntu 22.04 LTS', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 12, trend: 'up', status: 'active' },
    { id: 3, device: 'Ubuntu 22.04 LTS', processor: 'Average', usage: 12, trend: 'up', status: 'average' },
    { id: 4, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
    { id: 5, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
    { id: 6, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
    { id: 7, device: 'Windows 11 Pro', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' },
    { id: 8, device: 'Windows 11 Pro', processor: 'Average', usage: 1, trend: 'stable', status: 'average' },
    { id: 9, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
    { id: 10, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
    { id: 11, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'down', status: 'active' },
    { id: 12, device: 'CentOS 7', processor: 'AMD Ryzen 9 5950X 16-Core Processor', usage: 1, trend: 'stable', status: 'active' }
  ];

  const toggleSort = (key) => {
    if (key === 'device' || key === 'processor') return;
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
    return sortEntry.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  const filteredAndSortedData = useMemo(() => {
    let items = [...CPUHealthData];
    if (selectedDevice !== 'All') {
      items = items.filter(item => item.device === selectedDevice);
    }
    items = items.filter(item =>
      item.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.processor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.length === 0) return items;

    return items.sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        let comparison = 0;
        if (a[key] < b[key]) comparison = -1;
        if (a[key] > b[key]) comparison = 1;
        if (comparison !== 0) return direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }, [CPUHealthData, selectedDevice, searchTerm, sortConfig]);

  const getUsageColor = (usage) => {
    if (usage <= 5) return 'bg-green-500';
    if (usage <= 20) return 'bg-yellow-500';
    if (usage <= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUsageBarColor = (usage) => {
    if (usage <= 5) return 'bg-green-400';
    if (usage <= 20) return 'bg-yellow-400';
    if (usage <= 50) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="rounded-lg shadow-md overflow-visible relative" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
        <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>
            CPU Health ({filteredAndSortedData.length})
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search devices or processors..."
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

        <div className="max-h-[25rem] overflow-x-auto overflow-y-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[600px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <thead>
                <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
                  {['device', 'processor', 'usage'].map((key) => (
                    <th key={key} className={`py-2 px-4 ${key === 'usage' ? 'cursor-pointer' : ''}`} onClick={() => toggleSort(key)}>
                      <div className="flex items-center">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/health/cpu/cpuoverview`)}
                    className={`cursor-pointer hover:opacity-80 transition-opacity ${isDarkMode ? (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}
                  >
                    <td className="py-2 px-4 flex items-center">
                      <div className="w-1 h-6 bg-cyan-400 rounded-full mr-2"></div>
                      {item.device}
                    </td>
                    <td className="py-2 px-4">{item.processor}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend)}
                        <div
                          className="relative w-[100px] h-[8px] rounded-full bg-gray-300 dark:bg-[#374151] overflow-hidden"
                          role="progressbar"
                          aria-valuenow={item.usage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          title={`CPU Usage: ${item.usage}%`}
                        >
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

export default CPUHealth;

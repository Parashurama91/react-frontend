import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Cpu, Monitor, BarChart3, TrendingUp, Activity, Network, Upload, Download } from 'lucide-react';

export const DiskIODetails = ({isDarkMode}) => {
  // Simulating dark mode state
  const [currentTime] = useState(new Date());
  const [selectedGraphType, setSelectedGraphType] = useState('bar');
 

  const processor = 'DISK-0'; // Simulating processor param

  const cardClass = `rounded-lg shadow-md p-4 h-88 ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  const graphTypes = [
    { id: 'bar', label: 'Bar', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'area', label: 'Area', icon: Activity }
  ];

const renderChart = (chartData, selectedGraphType, isDarkMode) => {
  const commonProps = {
    width: "100%",
    height: "100%"
  };

  const tooltipStyle = {
    fontSize: '10px',
    padding: '4px 6px',
    backgroundColor: isDarkMode ? '#1f2937' : '#f9f9f9',
    color: isDarkMode ? '#f9f9f9' : '#1f2937',
  };

  const preferredOrder = [
  'reads', 'writes',
  'bytereads', 'bytewrites',
  'readtime', 'writetime',
  'dropOut', 'dropIn'
];

const keys = chartData?.length
  ? preferredOrder.filter(k => k in chartData[0])
  : [];

  // Map each key to a specific color   
  const colorMap = {
    reads: '#22c55e',            // green
    writes: '#3b82f6',        // blue
    readtime: '#22c55e',        // green
    writetime: '#3b82f6',         // blue
    bytereads: '#f97316',      // orange
    bytewrites: '#a855f7',  // purple
    dropOut: '#f97316',         // orange
    dropIn: '#a855f7'           // purple
  };

  // Unit mapping based on any matching key
  let unit = 'value/s';
  if (keys.some(k => ['reads', 'writes'].includes(k))) unit = 'ops/s';
  else if (keys.some(k => ['readtime', 'writetime'].includes(k))) unit = 'ms';
  else if (keys.some(k => ['bytereads', 'bytewrites'].includes(k))) unit = 'MB/s';
  else if (keys.some(k => ['dropIn', 'dropOut'].includes(k))) unit = 'drops/s';

 const tooltipFormatter = (value, name) => {
  if (value === undefined || value === null) return [`0.000 MB/s`, name];

  const isByteMetric = ['bytereads', 'bytewrites'].includes(name);
  const formattedValue = isByteMetric && typeof value === 'number'
    ? (value).toFixed(3)
    : value;

  return [`${formattedValue} ${isByteMetric ? 'MB/s' : unit}`, name];
};


const yAxisFormatter = (value) => {
  return typeof value === 'number' && keys.some(k => ['bytereads', 'bytewrites'].includes(k))
    ? (value).toFixed(3)
    : value;
};


  const renderLines = () =>
    keys.map((key) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colorMap[key] || '#8884d8'}
        strokeWidth={2}
        dot={false}
        name={key}
      />
    ));

  const renderAreas = () =>
    keys.map((key) => (
      <Area
        key={key}
        type="monotone"
        dataKey={key}
        stackId="1"
        stroke={colorMap[key] || '#8884d8'}
        fill={colorMap[key] || '#8884d8'}
        fillOpacity={0.6}
        name={key}
      />
    ));

  const renderBars = () =>
    keys.map((key) => (
      <Bar
        key={key}
        dataKey={key}
        fill={colorMap[key] || '#8884d8'}
        name={key}
      />
    ));

  switch (selectedGraphType) {
    case 'line':
      return (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={yAxisFormatter} />
            <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} itemStyle={{ fontSize: '12px' }} />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={yAxisFormatter} />
            <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} itemStyle={{ fontSize: '12px' }} />
            {renderAreas()}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart data={chartData.slice(-10)}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={yAxisFormatter} />
            <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} itemStyle={{ fontSize: '12px' }} />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};

 // Disk read and write I/O state
const [diskIOData, setDiskIOData] = useState({
  readCount: 0,
  writeCount: 0,
  readCountPerSec: 0,
  writeCountPerSec: 0,
});

const [diskChartData, setDiskChartData] = useState([]);
// Use ref to track the latest per-second increments
const diskRef = useRef({ readIncrement: 0, writeIncrement: 0 });

// Simulate disk I/O updates every second
useEffect(() => {
  const interval = setInterval(() => {
    const readIncrement = Math.floor(Math.random() * 50 + 10);   // 10–59
    const writeIncrement = Math.floor(Math.random() * 40 + 5);   // 5–44

    diskRef.current = { readIncrement, writeIncrement };

    setDiskIOData(prev => ({
      readCount: prev.readCount + readIncrement,
      writeCount: prev.writeCount + writeIncrement,
      readCountPerSec: readIncrement,
      writeCountPerSec: writeIncrement,
    }));
  }, 1000);

  return () => clearInterval(interval);
}, []);

// Update diskChartData whenever diskIOData changes
useEffect(() => {
  const timestamp = new Date().toLocaleTimeString();
  const { readIncrement, writeIncrement } = diskRef.current;

  setDiskChartData(prev => {
    const updated = [
      ...prev,
      {
        time: timestamp,
        reads: readIncrement,
        writes: writeIncrement,
      }
    ];
    return updated.slice(-20); // keep only last 20 points
  });
}, [diskIOData]);

// Disk bytesread and byteswrite IO
 const [diskbytesIOData, setDiskIO] = useState({
  bytesRead: 0,
  bytesWritten: 0,
  bytesReadPerSec: 0,
  bytesWrittenPerSec: 0
});
const [diskByteChartData, setDiskByteChartData] = useState([]);
const diskByteRef = useRef({ bytesreadIncrement: 0, byteswriteIncrement: 0 });

useEffect(() => {
  const interval = setInterval(() => {
    const bytesreadIncrement = Math.floor(Math.random() * 1024 * 1024 * 2);  // 0–2MB
    const byteswriteIncrement = Math.floor(Math.random() * 1024 * 1024 * 3); // 0–3MB
    
   diskByteRef.current = { bytesreadIncrement, byteswriteIncrement };

    setDiskIO(prev => ({
      bytesRead: prev.bytesRead + bytesreadIncrement,
      bytesWritten: prev.bytesWritten + byteswriteIncrement,
      bytesReadPerSec: bytesreadIncrement,
      bytesWrittenPerSec: byteswriteIncrement
    }));
  }, 1000);

  return () => clearInterval(interval);
}, []);
// Update diskChartData whenever diskIOData changes
useEffect(() => {
  const timestamp = new Date().toLocaleTimeString();
  const { bytesreadIncrement, byteswriteIncrement } = diskByteRef.current;

  
  setDiskByteChartData(prev => {
    const updated = [
      ...prev,
      { 
        time: timestamp,
        bytereads: bytesreadIncrement/(1024 * 1024),
        bytewrites: byteswriteIncrement/(1024*1024),
      }
    ];
    return updated.slice(-20); // keep only last 20 points
  });
}, [diskbytesIOData]);


  // Disk time read/write IO (in milliseconds)
const [diskTimeIOData, setDiskTimeIOData] = useState({
  readTime: 0,
  writeTime: 0,
  readTimePerSec: 0,
  writeTimePerSec: 0
});

const [diskTimeIOChartData, setDiskTimeIOChartData] = useState([]);
const diskTimeIORef = useRef({ readTimeIncrement: 0, writeTimeIncrement: 0 });

// Simulate read/write I/O time updates every 1 second
useEffect(() => {
  const interval = setInterval(() => {
    const readTimeIncrement = Math.floor(Math.random() * 200);  // 0–200 ms
    const writeTimeIncrement = Math.floor(Math.random() * 300); // 0–300 ms

    diskTimeIORef.current = { readTimeIncrement, writeTimeIncrement };

    setDiskTimeIOData(prev => ({
      readTime: prev.readTime + readTimeIncrement,
      writeTime: prev.writeTime + writeTimeIncrement,
      readTimePerSec: readTimeIncrement,
      writeTimePerSec: writeTimeIncrement
    }));
  }, 1000);

  return () => clearInterval(interval);
}, []);

// Update chart data when disk time IO data changes
useEffect(() => {
  const timestamp = new Date().toLocaleTimeString();
  const { readTimeIncrement, writeTimeIncrement } = diskTimeIORef.current;

  setDiskTimeIOChartData(prev => {
    const updated = [
      ...prev,
      {
        time: timestamp,
        readtime: readTimeIncrement,
        writetime: writeTimeIncrement
      }
    ];
    return updated.slice(-20); // keep only last 20 points
  });
}, [diskTimeIOData]);

  // Utility functions
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
 const formatTime = (ms) => {
  if (ms === 0) return '0 ms';

  const s = 1000;
  const m = s * 60;
  const h = m * 60;

  if (ms < s) {
    return `${ms.toFixed(0)} ms`;
  } else if (ms < m) {
    return `${(ms / s).toFixed(2)} sec`;
  } else if (ms < h) {
    return `${(ms / m).toFixed(2)} min`;
  } else {
    return `${(ms / h).toFixed(2)} hr`;
  }
};

  const getSpeedColor = (speedMbps) => {
    if (speedMbps < 0.1) return 'text-red-600';
    if (speedMbps < 1) return 'text-yellow-600';
    if (speedMbps < 10) return 'text-green-600';
    return 'text-blue-600';
  };

  const getSpeedIndicator = (speedMbps) => {
    if (speedMbps < 0.1) return { color: 'bg-red-500', label: 'Slow' };
    if (speedMbps < 1) return { color: 'bg-yellow-500', label: 'Medium' };
    if (speedMbps < 10) return { color: 'bg-green-500', label: 'Fast' };
    return { color: 'bg-blue-500', label: 'Very Fast' };
  };

//   const getPacketSpeedColor = (packetsPerSec) => {
//     if (packetsPerSec < 50) return 'text-red-600';
//     if (packetsPerSec < 100) return 'text-yellow-600';
//     if (packetsPerSec < 200) return 'text-green-600';
//     return 'text-blue-600';
//   };

//   const getPacketSpeedIndicator = (packetsPerSec) => {
//     if (packetsPerSec < 50) return { color: 'bg-red-500', label: 'Low' };
//     if (packetsPerSec < 100) return { color: 'bg-yellow-500', label: 'Medium' };
//     if (packetsPerSec < 200) return { color: 'bg-green-500', label: 'High' };
//     return { color: 'bg-blue-500', label: 'Very High' };
//   };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-1 sticky">
        <div className={`rounded-lg shadow-md p-4 h-20 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {/* Icon + Text Group */}
          <div className="flex items-center space-x-4">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-500">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>192.168.100.51</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Windows 6.2.9200</p>
              </div>
            </div>
          </div>
          {/* Graph Type Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 mr-2">Graph Type:</span>
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
              <Network className="w-4 h-4 text-white" />
            </div>
            {/* Title & Description */}
            <div>
              <h3 className="text-lg font-semibold">DISK I/O Monitoring</h3>
              <p className="text-sm text-gray-500">{processor}</p>
            </div>
          </div>
          {/* Time */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {currentTime.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Row 2: Network Traffic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
    {/* Title */}
    <div className="flex items-center gap-1 mb-2">
      <h4 className="text-md font-semibold">Disk I/O: ReadCount & WriteCount Operations</h4>
    </div>

    {/* Disk Read/Write Stats */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Read Count */}
      <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Upload className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-800">ReadCount</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(diskIOData.readCountPerSec).color}`}></div>
            <span className="text-xs text-gray-600">
              {getSpeedIndicator(diskIOData.readCountPerSec).label}
            </span>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-green-900">
            {diskIOData.readCount}
          </div>
          <div className={`text-xs font-semibold ${getSpeedColor(diskIOData.readCountPerSec)}`}>
            {diskIOData.readCountPerSec} ops/s
          </div>
        </div>
      </div>

      {/* Write Count */}
      <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">WritesCount</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(diskIOData.writeCountPerSec).color}`}></div>
            <span className="text-xs text-gray-600">
              {getSpeedIndicator(diskIOData.writeCountPerSec).label}
            </span>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-blue-900">
            {diskIOData.writeCount}
          </div>
          <div className={`text-xs font-semibold ${getSpeedColor(diskIOData.writeCountPerSec)}`}>
            {diskIOData.writeCountPerSec} ops/s
          </div>
        </div>
      </div>
    </div>

    {/* Graph Section */}
    <div>
      <div className={`flex items-center justify-between mb-3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h3 className="text-sm font-medium">Disk I/O (ops/s)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Reads</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Writes</span>
          </div>
        </div>
      </div>

      <div className="h-40 -ml-8">
        <ResponsiveContainer width="100%" height="100%">
          <div className="h-48">
            {renderChart(diskChartData, selectedGraphType, isDarkMode)}
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
        {/* Network Packets */}
        <div className={cardClass}>
          <div className="flex items-center gap- mb-2">
            <h4 className="text-md font-semibold">Disk I/O: Bytes Read & Written</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Packets Sent */}
            <div className="bg-orange-50 p-2 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium text-orange-500">Bytesread</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(diskbytesIOData.bytesReadPerSec/(1024 * 1024)).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getSpeedIndicator(diskbytesIOData.bytesReadPerSec/ (1024 * 1024)).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-orange-500">
                  {formatBytes(diskbytesIOData.bytesRead)}
                </div>
                <div className={`text-xs font-semibold ${getSpeedColor(diskbytesIOData.bytesReadPerSec/(1024 * 1024))}`}>
                  {(diskbytesIOData.bytesReadPerSec/(1024 * 1024)).toFixed(3)} MB/s
                </div>
              </div>
            </div>
            {/* Packets Received */}
            <div className="bg-purple-50 p-2 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-800">Byteswrite</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(diskbytesIOData.bytesWrittenPerSec/(1024 * 1024)).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getSpeedIndicator(diskbytesIOData.bytesWrittenPerSec/(1024 * 1024)).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-purple-900">
                  {formatBytes(diskbytesIOData.bytesWritten)}
                </div>
                <div className={`text-xs font-semibold ${getSpeedColor(diskbytesIOData.bytesWrittenPerSec/(1024 * 1024))}`}>
                  {(diskbytesIOData.bytesWrittenPerSec/ (1024 * 1024)).toFixed(3)} MB/s
                </div>
              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb-">
             <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm font-medium">Disk Bytes ()</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-orange-600"></div>
                  <span>Bytesread</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-purple-500"></div>
                  <span>Byteswrite</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
                <ResponsiveContainer width="100%" height="100%">
                 <div className="h-48">
                    {renderChart(diskByteChartData, selectedGraphType, isDarkMode)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Packet Errors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Disk I/O Response Time (ms)</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Error Out */}
            <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800">ReadTime</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(diskTimeIOData.readTimePerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(diskTimeIOData.readTimePerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-green-800">
                  {formatTime(diskTimeIOData.readTime)}
                </div>
               <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {diskTimeIOData.readTimePerSec} ms
                </div>
              </div>
            </div>
            {/* Error In */}
            <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-800">WriteTime</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(diskTimeIOData.writeTimePerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(diskTimeIOData.writeTimePerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-blue-900">
                  {formatTime(diskTimeIOData.writeTime)}
                </div>
                <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {diskTimeIOData.writeTimePerSec} ms
                </div>

              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb-">
            <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm font-medium"> Disk Read/Write Time I/O (ms)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-green-600"></div>
                  <span>ReadTime</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>WriteTime</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                 <div className="h-48">
                    {renderChart(diskTimeIOChartData, selectedGraphType, isDarkMode)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
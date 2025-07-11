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


export const NetworkDetails = ({isDarkMode}) => {
  // Simulating dark mode state
  const [currentTime] = useState(new Date());
  const [selectedGraphType, setSelectedGraphType] = useState('bar');
  const processor = 'Intel Core i7-12700K'; // Simulating processor param

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
  'sent', 'received',
  'errorOut', 'errorIn',
  'packetsent', 'packetreceived',
  'dropOut', 'dropIn'
];

const keys = chartData?.length
  ? preferredOrder.filter(k => k in chartData[0])
  : [];

  // Map each key to a specific color
  const colorMap = {
    sent: '#22c55e',            // green
    received: '#3b82f6',        // blue
    errorOut: '#22c55e',        // green
    errorIn: '#3b82f6',         // blue
    packetsent: '#f97316',      // orange
    packetreceived: '#a855f7',  // purple
    dropOut: '#f97316',         // orange
    dropIn: '#a855f7'           // purple
  };

  // Unit mapping based on any matching key
  let unit = 'value/s';
  if (keys.some(k => ['sent', 'received'].includes(k))) unit = 'MB/s';
  else if (keys.some(k => ['errorOut', 'errorIn'].includes(k))) unit = 'errors/s';
  else if (keys.some(k => ['packetsent', 'packetreceived'].includes(k))) unit = 'pps';
  else if (keys.some(k => ['dropIn', 'dropOut'].includes(k))) unit = 'drops/s';

 const tooltipFormatter = (value, name) => {
  if (value === undefined || value === null) return [`0.000 ${unit}`, name];

  const formattedValue = ['sent', 'received'].includes(name) && typeof value === 'number'
    ? value.toFixed(3)
    : value;

  return [`${formattedValue} ${unit}`, name];
};


  const yAxisFormatter = (value) => {
  const hasBytes = keys.some(k => ['sent', 'received'].includes(k));
  return hasBytes && typeof value === 'number' ? value.toFixed(3) : value;
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

  // Network bytes state
  const [networkData, setNetworkData] = useState({
    bytesSent: 0,
    bytesReceived: 0,
    bytesSentPerSec: 0,
    bytesReceivedPerSec: 0
  });

  const [chartData, setChartData] = useState([]);

  // Simulate network data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      setNetworkData(prev => {
        const newBytesSent = prev.bytesSent + Math.floor(Math.random() * 1000 + 500);
        const newBytesReceived = prev.bytesReceived + Math.floor(Math.random() * 2000 + 1000);
        const sentPerSec = newBytesSent - prev.bytesSent;
        const receivedPerSec = newBytesReceived - prev.bytesReceived;

        // Update chart data
        setChartData(prevChart => {
          const newData = [
            ...prevChart,
            {
              time: timestamp,
              sent: sentPerSec / (1024 * 1024), // Convert to MB/s
              received: receivedPerSec / (1024 * 1024) // Convert to MB/s
            }
          ];
          // Keep only last 20 data points
          return newData.slice(-20);
        });

        return {
          bytesSent: newBytesSent,
          bytesReceived: newBytesReceived,
          bytesSentPerSec: sentPerSec,
          bytesReceivedPerSec: receivedPerSec
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Network packets state
  const [networkpacketData, setNetworkPacketData] = useState({
    packetsSent: 0,
    packetsReceived: 0,
    packetsSentPerSec: 0,
    packetsReceivedPerSec: 0,
  });

  const [chartpacketData, setChartPacketData] = useState([]);

  const packetRef = useRef({ sentIncrement: 0, receivedIncrement: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const sentIncrement = Math.floor(Math.random() * 100 + 50);
      const receivedIncrement = Math.floor(Math.random() * 150 + 100);

      packetRef.current = { sentIncrement, receivedIncrement };

      setNetworkPacketData(prev => ({
        packetsSent: prev.packetsSent + sentIncrement,
        packetsReceived: prev.packetsReceived + receivedIncrement,
        packetsSentPerSec: sentIncrement,
        packetsReceivedPerSec: receivedIncrement,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const { sentIncrement, receivedIncrement } = packetRef.current;

    setChartPacketData(prev => {
      const updated = [
        ...prev,
        {
          time: timestamp,
          packetsent: sentIncrement,
          packetreceived: receivedIncrement,
        }
      ];
      return updated.slice(-20); // keep only last 20
    });
  }, [networkpacketData]);

  // Packet error state
  const [packetErrorData, setPacketErrorData] = useState({
    errorIn: 0,
    errorOut: 0,
    errorInPerSec: 0,
    errorOutPerSec: 0,
  });

  const [chartPacketErrorData, setChartPacketErrorData] = useState([]);

  const packetErrorRef = useRef({ errorInIncrement: 0, errorOutIncrement: 0 });

  // Simulate error increments every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      const errorInIncrement = Math.floor(Math.random() * 5);   // Random 0–4 errors/sec
      const errorOutIncrement = Math.floor(Math.random() * 3);  // Random 0–2 errors/sec

      packetErrorRef.current = { errorInIncrement, errorOutIncrement };

      setPacketErrorData(prev => ({
        errorIn: prev.errorIn + errorInIncrement,
        errorOut: prev.errorOut + errorOutIncrement,
        errorInPerSec: errorInIncrement,
        errorOutPerSec: errorOutIncrement,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Append to chart error data
    useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const { errorInIncrement, errorOutIncrement } = packetErrorRef.current;

    setChartPacketErrorData(prev => {
      const updated = [
        ...prev,
        {
          time: timestamp,
          errorIn: errorInIncrement,
          errorOut: errorOutIncrement,
        },
      ];
      return updated.slice(-20); // Keep last 20 data points
    });
  }, [packetErrorData]);

    // Drop packet state
    const [packetDropData, setPacketDropData] = useState({
    dropIn: 0,
    dropOut: 0,
    dropInPerSec: 0,
    dropOutPerSec: 0,
    });

    const [chartPacketDropData, setChartPacketDropData] = useState([]);

    const packetDropRef = useRef({ dropInIncrement: 0, dropOutIncrement: 0 });

    // Simulate drop increments every 1s
    useEffect(() => {
    const interval = setInterval(() => {
        const dropInIncrement = Math.floor(Math.random() * 3);   // Random 0–3 drops/sec
        const dropOutIncrement = Math.floor(Math.random() * 2);  // Random 0–1 drops/sec

        packetDropRef.current = { dropInIncrement, dropOutIncrement };

        setPacketDropData(prev => ({
        dropIn: prev.dropIn + dropInIncrement,
        dropOut: prev.dropOut + dropOutIncrement,
        dropInPerSec: dropInIncrement,
        dropOutPerSec: dropOutIncrement,
        }));
    }, 1000);

    return () => clearInterval(interval);
    }, []);

// Append to chart drop data
useEffect(() => {
  const timestamp = new Date().toLocaleTimeString();
  const { dropInIncrement, dropOutIncrement } = packetDropRef.current;

  setChartPacketDropData(prev => {
    const updated = [
      ...prev,
      {
        time: timestamp,
        dropIn: dropInIncrement,
        dropOut: dropOutIncrement,
      },
    ];
    return updated.slice(-20); // Keep only last 20
  });
}, [packetDropData]);


  // Utility functions
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getPacketSpeedColor = (packetsPerSec) => {
    if (packetsPerSec < 50) return 'text-red-600';
    if (packetsPerSec < 100) return 'text-yellow-600';
    if (packetsPerSec < 200) return 'text-green-600';
    return 'text-blue-600';
  };

  const getPacketSpeedIndicator = (packetsPerSec) => {
    if (packetsPerSec < 50) return { color: 'bg-red-500', label: 'Low' };
    if (packetsPerSec < 100) return { color: 'bg-yellow-500', label: 'Medium' };
    if (packetsPerSec < 200) return { color: 'bg-green-500', label: 'High' };
    return { color: 'bg-blue-500', label: 'Very High' };
  };

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
              <h3 className="text-lg font-semibold">Network I/O Monitoring</h3>
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
          <div className="flex items-center gap-1 mb-2">
            <h4 className="text-md font-semibold">Network Traffic: Bytes Sent & Received</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Bytes Sent */}
            <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Sent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(networkData.bytesSentPerSec / (1024 * 1024)).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getSpeedIndicator(networkData.bytesSentPerSec / (1024 * 1024)).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-green-900">
                  {formatBytes(networkData.bytesSent)}
                </div>
                <div className={`text-xs font-semibold ${getSpeedColor(networkData.bytesSentPerSec / (1024 * 1024))}`}>
                  {(networkData.bytesSentPerSec / (1024 * 1024)).toFixed(3)} MB/s
                </div>
              </div>
            </div>
            {/* Bytes Received */}
            <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Received</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getSpeedIndicator(networkData.bytesReceivedPerSec / (1024 * 1024)).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getSpeedIndicator(networkData.bytesReceivedPerSec / (1024 * 1024)).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-blue-900">
                  {formatBytes(networkData.bytesReceived)}
                </div>
                <div className={`text-xs font-semibold ${getSpeedColor(networkData.bytesReceivedPerSec / (1024 * 1024))}`}>
                  {(networkData.bytesReceivedPerSec / (1024 * 1024)).toFixed(3)} MB/s
                </div>
              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb- " >
             <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm font-medium">Network Speed (MB/s)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Sent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Received</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <div className="h-48">
                    {renderChart(chartData, selectedGraphType, isDarkMode)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Network Packets */}
        <div className={cardClass}>
          <div className="flex items-center gap- mb-2">
            <h4 className="text-md font-semibold">Network Packets: Sent & Received</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Packets Sent */}
            <div className="bg-orange-50 p-2 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium text-orange-500">Sent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getPacketSpeedIndicator(networkpacketData.packetsSentPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getPacketSpeedIndicator(networkpacketData.packetsSentPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-orange-500">
                  {networkpacketData.packetsSent}
                </div>
                <div className={`text-xs font-semibold ${getPacketSpeedColor(networkpacketData.packetsSentPerSec)}`}>
                  {networkpacketData.packetsSentPerSec} pps
                </div>
              </div>
            </div>
            {/* Packets Received */}
            <div className="bg-purple-50 p-2 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-800">Received</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getPacketSpeedIndicator(networkpacketData.packetsReceivedPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {getPacketSpeedIndicator(networkpacketData.packetsReceivedPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-purple-900">
                  {networkpacketData.packetsReceived}
                </div>
                <div className={`text-xs font-semibold ${getPacketSpeedColor(networkpacketData.packetsReceivedPerSec)}`}>
                  {networkpacketData.packetsReceivedPerSec} pps
                </div>
              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb-">
             <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm font-medium">Network Packets (pps)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-orange-600"></div>
                  <span>Sent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-purple-500"></div>
                  <span>Received</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
                <ResponsiveContainer width="100%" height="100%">
                 <div className="h-48">
                    {renderChart(chartpacketData, selectedGraphType, isDarkMode)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Packet Errors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Network PacketErrors Overview</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Error Out */}
            <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Out</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(packetErrorData.errorOutPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(packetErrorData.errorOutPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-green-800">
                  {packetErrorData.errorOut}
                </div>
               <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {packetErrorData.errorOutPerSec} errors/s
                </div>
              </div>
            </div>
            {/* Error In */}
            <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-800">In</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(packetErrorData.errorInPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(packetErrorData.errorInPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-blue-900">
                  {packetErrorData.errorIn}
                </div>
                <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {packetErrorData.errorInPerSec} errors/s
                </div>

              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb-">
            <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm font-medium">Network PacketErrors (error/sec)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-green-600"></div>
                  <span>Out</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>In</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                 <div className="h-48">
                    {renderChart(chartPacketErrorData, selectedGraphType, isDarkMode)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Packet Drops Placeholder */}
        <div className={cardClass}>
          <h4 className="text-md font-semibold mb-2">Network PacketDrops Overview</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Error Out */}
            <div className="bg-orange-50 p-2 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Upload className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium text-orange-500">Out</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(packetDropData.dropOutPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(packetDropData.dropOutPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-orange-500">
                  {packetDropData.dropOut}
                </div>
                <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {packetDropData.dropOutPerSec} drops/s
                </div>
              </div>
            </div>
            {/* Error In */}
            <div className="bg-purple-50 p-2 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-900">In</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${(packetDropData.dropInPerSec).color}`}></div>
                  <span className="text-xs text-gray-600">
                    {(packetDropData.dropInPerSec).label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-purple-900">
                  {packetDropData.dropIn}
                </div>
                <div className={`text-xs font-semibold text-gray-700 dark:text-white`}>
                  {packetDropData.dropInPerSec} drops/sec
                </div>
              </div>
            </div>
          </div>
          {/* Graph */}
          <div className="mb-4" >
            <div className={`flex items-center justify-between mb-3 ${isDarkMode? 'text-white' : 'bg-white text-gray-900'}`}>
              <h3 className={'text-sm font-medium'}>Network PacketDrops (drops/sec)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-orange-500"></div>
                  <span>Out</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-purple-500"></div>
                  <span>In</span>
                </div>
              </div>
            </div>
            <div className="h-40 -ml-8">
             <ResponsiveContainer width="100%" height="100%">
                 <div className="h-48">
                    {renderChart(chartPacketDropData, selectedGraphType)}
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
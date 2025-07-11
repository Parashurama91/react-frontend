import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, Activity } from "lucide-react";

const networkData = [
  {
    device: "router-01.core",
    port: "lo",
    errors: 0,
    bitsIn: "2.59kbps",
    bitsOut: "2.59kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "2pps",
    pktsOut: "2pps",
    mtu: 65536,
    media: "Loopback",
    mac: "",
    ipVersion: "IPv6"
  },
  {
    device: "router-01.core",
    port: "eth0",
    errors: 0,
    bitsIn: "16kbps",
    bitsOut: "77.1kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "9pps",
    pktsOut: "8pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:e4:27:da",
    ipVersion: "IPv6"
  },
  {
    device: "switch-01.dc1",
    port: "lo",
    errors: 0,
    bitsIn: "6.18kbps",
    bitsOut: "6.18kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "4pps",
    pktsOut: "4pps",
    mtu: 65536,
    media: "Loopback",
    mac: "",
    ipVersion: "IPv6"
  },
  {
    device: "switch-01.dc1",
    port: "eth1",
    errors: 0,
    bitsIn: "1.88kbps",
    bitsOut: "4.74kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "2pps",
    pktsOut: "1pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:4c:a2:fb",
    ipVersion: "IPv6"
  },
  {
    device: "firewall-01.edge",
    port: "lo",
    errors: 0,
    bitsIn: "24.7kbps",
    bitsOut: "24.7kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "13pps",
    pktsOut: "13pps",
    mtu: 65536,
    media: "Loopback",
    mac: "",
    ipVersion: "IPv6"
  },
  {
    device: "firewall-01.edge",
    port: "eth0",
    errors: 0,
    bitsIn: "5.08kbps",
    bitsOut: "890kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "5pps",
    pktsOut: "6pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:42:53:2f",
    ipVersion: "IPv6"
  },
  {
    device: "router-02.core",
    port: "eth1",
    errors: 0,
    bitsIn: "16kbps",
    bitsOut: "77.1kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "9pps",
    pktsOut: "8pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:e4:27:da",
    ipVersion: "IPv6"
  },
  {
    device: "switch-02.dc1",
    port: "lo",
    errors: 0,
    bitsIn: "6.18kbps",
    bitsOut: "6.18kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "4pps",
    pktsOut: "4pps",
    mtu: 65536,
    media: "Loopback",
    mac: "",
    ipVersion: "IPv6"
  },
  {
    device: "switch-02.dc1",
    port: "eth2",
    errors: 0,
    bitsIn: "1.88kbps",
    bitsOut: "4.74kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "2pps",
    pktsOut: "1pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:4c:a2:fb",
    ipVersion: "IPv6"
  },
  {
    device: "firewall-02.edge",
    port: "lo",
    errors: 0,
    bitsIn: "24.7kbps",
    bitsOut: "24.7kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "13pps",
    pktsOut: "13pps",
    mtu: 65536,
    media: "Loopback",
    mac: "",
    ipVersion: "IPv6"
  },
  {
    device: "firewall-02.edge",
    port: "eth1",
    errors: 0,
    bitsIn: "5.08kbps",
    bitsOut: "890kbps",
    percentIn: 0,
    percentOut: 0,
    pktsIn: "5pps",
    pktsOut: "6pps",
    mtu: 1500,
    media: "Ethernet",
    mac: "52:54:00:42:53:2f",
    ipVersion: "IPv6"
  }
];

const parseNetworkValue = (str) => {
  const units = { bps: 1, kbps: 1000, Mbps: 1000000, Gbps: 1000000000, pps: 1 };
  const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
  if (!match) return 0;
  const [, num, unit] = match;
  return parseFloat(num) * (units[unit] || 1);
};

const getActivityIcon = (bitsIn, bitsOut) => {
  const inValue = parseNetworkValue(bitsIn);
  const outValue = parseNetworkValue(bitsOut);
  
  if (inValue > 0 || outValue > 0) {
    return <Activity className="w-4 h-4 text-green-500" title="Active" />;
  }
  return <Activity className="w-4 h-4 text-gray-400" title="Inactive" />;
};

const getPortTypeColor = (media) => {
  switch (media.toLowerCase()) {
    case 'loopback':
      return 'bg-blue-400';
    case 'ethernet':
      return 'bg-green-400';
    default:
      return 'bg-gray-400';
  }
};

const getIPVersionBadge = (version) => {
  return (
    <span className={`text-xs px-2 py-1 rounded text-white font-medium ${
      version === 'IPv6' ? 'bg-blue-500' : 'bg-purple-500'
    }`}>
      {version}
    </span>
  );
};

const compareNetworkValues = (a, b, field, direction) => {
  let valA = a[field];
  let valB = b[field];

  if (["bitsIn", "bitsOut", "pktsIn", "pktsOut", "speed"].includes(field)) {
    valA = parseNetworkValue(valA);
    valB = parseNetworkValue(valB);
  }

  if (valA < valB) return direction === "asc" ? -1 : 1;
  if (valA > valB) return direction === "asc" ? 1 : -1;
  return 0;
};

const NetworkInterfaces = ({ isDarkMode = true }) => {
  const [sortStack, setSortStack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSort = (field) => {
    setSortStack((prev) => {
      const foundIndex = prev.findIndex((s) => s.field === field);

      if (foundIndex !== -1) {
        const currentDirection = prev[foundIndex].direction;

        if (currentDirection === "asc") {
          const updated = [...prev];
          updated[foundIndex] = { field, direction: "desc" };
          return updated;
        } else if (currentDirection === "desc") {
          return prev.filter((_, index) => index !== foundIndex);
        }
      }

      return [...prev, { field, direction: "asc" }];
    });
  };

  const getSortArrow = (field) => {
    const found = sortStack.find((s) => s.field === field);
    if (!found) return null;
    return found.direction === "asc" ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  const filteredRows = useMemo(() => {
    let rows = [...networkData];
    if (searchTerm.trim()) {
      rows = rows.filter(row =>
        row.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.port.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.media.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    for (const { field, direction } of sortStack) {
      rows.sort((a, b) => compareNetworkValues(a, b, field, direction));
    }

    return rows;
  }, [searchTerm, sortStack]);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="rounded-lg shadow-md overflow-visible relative" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
        <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>Network Interfaces ({filteredRows.length})</span>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search devices or types..."
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

        <div className="max-h-[25rem] overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            {filteredRows.length === 0 ? (
              <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                No devices match your search.
              </div>
            ) : (
              <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[600px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <thead>
                  <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
                    <th className="py-2 px-4">Device</th>
                    <th className="py-2 px-4">Port</th>
                    <th onClick={() => toggleSort('bitsIn')} className="py-2 px-4 cursor-pointer">
                      <div className="flex items-center">
                        Bits In
                        {getSortArrow('bitsIn')}
                      </div>
                    </th>
                    <th onClick={() => toggleSort('bitsOut')} className="py-2 px-4 cursor-pointer">
                      <div className="flex items-center">
                        Bits Out
                        {getSortArrow('bitsOut')}
                      </div>
                    </th>
                    <th onClick={() => toggleSort('pktsIn')} className="py-2 px-4 cursor-pointer">
                      <div className="flex items-center">
                        Packets In
                        {getSortArrow('pktsIn')}
                      </div>
                    </th>
                    <th onClick={() => toggleSort('pktsOut')} className="py-2 px-4 cursor-pointer">
                      <div className="flex items-center">
                        Packets Out
                        {getSortArrow('pktsOut')}
                      </div>
                    </th>
                    <th className="py-2 px-4">MAC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => (
                    <tr key={idx} className={`${isDarkMode ? (idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : (idx % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}>
                      <td className="py-2 px-4 flex items-center">
                        <div className={`w-1 h-6 ${getPortTypeColor(row.media)} rounded-full mr-2`}></div>
                        {row.device}
                      </td>
                      <td className="py-2 px-4">{row.port}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          {getIPVersionBadge(row.ipVersion)}
                          <ArrowDown className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-500">{row.bitsIn}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">{row.bitsOut}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="w-4 h-4 text-purple-500" />
                          <span className="text-purple-500">{row.pktsIn}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-500">{row.pktsOut}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {row.mac ? (
                          <span className="font-mono text-sm">{row.mac}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkInterfaces;
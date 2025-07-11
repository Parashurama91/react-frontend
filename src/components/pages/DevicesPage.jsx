import Windows from "../../assets/Windows_logo.svg";
import Ubuntu from "../../assets/Ubunto_logo.svg";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const DevicesList = ({ isDarkMode = true }) => {
  const [sortStack, setSortStack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleSort = (field) => {
    setSortStack(prev => {
      const existing = prev.find(s => s.field === field);
      if (existing) {
        return existing.direction === 'asc'
          ? prev.map(s => s.field === field ? { ...s, direction: 'desc' } : s)
          : prev.filter(s => s.field !== field);
      } else {
        return [...prev, { field, direction: 'asc' }];
      }
    });
  };

  const getSortIcon = (field) => {
    const entry = sortStack.find(s => s.field === field);
    if (!entry) return null;
    return entry.direction === 'asc'
      ? <ChevronUp className="inline w-3 h-3 ml-1" />
      : <ChevronDown className="inline w-3 h-3 ml-1" />;
  };

  const ipToNumber = (ip) => ip.split('.').reduce((acc, octet) => acc * 256 + +octet, 0);
  const parseUptime = (uptime) => {
    const d = parseInt(uptime.match(/(\d+)\s*d/)?.[1] || 0);
    const h = parseInt(uptime.match(/(\d+)\s*h/)?.[1] || 0);
    const m = parseInt(uptime.match(/(\d+)\s*m/)?.[1] || 0);
    return d * 24 * 60 + h * 60 + m;
  };

  const compareValues = (a, b, field, direction) => {
    let valA, valB;
    switch (field) {
      case 'ip': valA = ipToNumber(a.ip); valB = ipToNumber(b.ip); break;
      case 'uptime': valA = parseUptime(a.uptime); valB = parseUptime(b.uptime); break;
      case 'status': valA = a.isActive ? 1 : 0; valB = b.isActive ? 1 : 0; break;
      case 'type': valA = a.type === 'Physical' ? 1 : 0; valB = b.type === 'Physical' ? 1 : 0; break;
      default: return 0;
    }
    return direction === 'asc' ? valA - valB : valB - valA;
  };

  const osLogos = { Windows, Ubuntu };
  const handleRowClick = (id) => navigate(`/devices/${id}`);

  const rows = [
    { id: 1, os: 'Windows', device_name: "windows 6.2.9200", type: 'Virtual', ip: '192.168.1.1', uptime: '3 d 12 h', isActive: true },
    { id: 2, os: 'Ubuntu', device_name: "ubuntu-server-01", type: 'Physical', ip: '192.168.1.2', uptime: '5 d 07 h', isActive: true },
    { id: 3, os: 'Windows', device_name: "windows-vm-01", type: 'Virtual', ip: '192.168.1.12', uptime: '2 d 19 h', isActive: true },
    { id: 4, os: 'Ubuntu', device_name: "ubuntu-vm-01", type: 'Virtual', ip: '192.168.1.13', uptime: '9 h 22 m', isActive: true },
    { id: 5, os: 'Windows', device_name: "windows-server-01", type: 'Physical', ip: '192.168.1.14', uptime: '12 d 01 h', isActive: true },
    { id: 6, os: 'Ubuntu', device_name: "ubuntu-server-02", type: 'Physical', ip: '192.168.1.15', uptime: '7 d 04 h', isActive: true },
    { id: 7, os: 'Windows', device_name: "windows-vm-02", type: 'Virtual', ip: '192.168.1.10', uptime: '3 d 12 h', isActive: false },
    { id: 8, os: 'Ubuntu', device_name: "ubuntu-vm-02", type: 'Virtual', ip: '192.168.1.11', uptime: '5 d 07 h', isActive: false },
    { id: 9, os: 'Windows', device_name: "windows-server-02", type: 'Physical', ip: '192.168.1.3', uptime: '2 d 19 h', isActive: false },
    { id: 10, os: 'Ubuntu', device_name: "ubuntu-server-03", type: 'Physical', ip: '192.168.1.5', uptime: '9 h 22 m', isActive: false },
    { id: 11, os: 'Windows', device_name: "windows-vm-03", type: 'Virtual', ip: '192.168.1.6', uptime: '12 d 01 h', isActive: false },
    { id: 12, os: 'Ubuntu', device_name: "ubuntu-vm-03", type: 'Virtual', ip: '192.168.1.7', uptime: '7 d 04 h', isActive: true },
    { id: 13, os: 'Windows', device_name: "windows-server-03", type: 'Physical', ip: '192.168.1.8', uptime: '3 d 12 h', isActive: true },
    { id: 14, os: 'Ubuntu', device_name: "ubuntu-server-04", type: 'Physical', ip: '192.168.1.9', uptime: '5 d 07 h', isActive: true },
    { id: 15, os: 'Windows', device_name: "windows-vm-04", type: 'Virtual', ip: '192.168.1.22', uptime: '2 d 19 h', isActive: true },
    { id: 16, os: 'Ubuntu', device_name: "ubuntu-vm-04", type: 'Virtual', ip: '192.168.1.23', uptime: '9 h 22 m', isActive: false },
    { id: 17, os: 'Windows', device_name: "windows-server-04", type: 'Physical', ip: '192.168.1.24', uptime: '12 d 01 h', isActive: false },
    { id: 18, os: 'Ubuntu', device_name: "ubuntu-server-05", type: 'Physical', ip: '192.168.1.25', uptime: '7 d 04 h', isActive: false },
    { id: 19, os: 'Windows', device_name: "windows-vm-05", type: 'Virtual', ip: '192.168.1.30', uptime: '3 d 12 h', isActive: true },
    { id: 20, os: 'Ubuntu', device_name: "ubuntu-vm-05", type: 'Virtual', ip: '192.168.1.31', uptime: '5 d 07 h', isActive: true },
    { id: 21, os: 'Windows', device_name: "windows-server-05", type: 'Physical', ip: '192.168.1.32', uptime: '2 d 19 h', isActive: true },
    { id: 22, os: 'Ubuntu', device_name: "ubuntu-vm-06", type: 'Virtual', ip: '192.168.1.33', uptime: '9 h 22 m', isActive: false },
    { id: 23, os: 'Windows', device_name: "windows-server-06", type: 'Physical', ip: '192.168.1.34', uptime: '12 d 01 h', isActive: false },
    { id: 24, os: 'Ubuntu', device_name: "ubuntu-server-06", type: 'Physical', ip: '192.168.1.55', uptime: '7 d 04 h', isActive: true },
    { id: 25, os: 'Windows', device_name: "windows-vm-06", type: 'Virtual', ip: '192.168.1.28', uptime: '3 d 12 h', isActive: false },
    { id: 26, os: 'Ubuntu', device_name: "ubuntu-vm-07", type: 'Virtual', ip: '192.168.1.29', uptime: '5 d 07 h', isActive: false },
    { id: 27, os: 'Windows', device_name: "windows-server-07", type: 'Physical', ip: '192.168.1.42', uptime: '2 d 19 h', isActive: true },
    { id: 28, os: 'Ubuntu', device_name: "ubuntu-server-07", type: 'Physical', ip: '192.168.1.43', uptime: '9 h 22 m', isActive: true },
    { id: 29, os: 'Windows', device_name: "windows-vm-07", type: 'Virtual', ip: '192.168.1.44', uptime: '12 d 01 h', isActive: true },
    { id: 30, os: 'Ubuntu', device_name: "ubuntu-vm-08", type: 'Virtual', ip: '192.168.1.45', uptime: '7 d 04 h', isActive: true },
  ];

  const displayRows = [...rows]
    .filter(row => 
      row.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.os.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      for (const { field, direction } of sortStack) {
        const result = compareValues(a, b, field, direction);
        if (result !== 0) return result;
      }
      return 0;
    });

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div
        className="rounded-lg shadow-md overflow-visible relative"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB'
        }}
      >
        <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>
            Devices List ({displayRows.length})
          </span>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search devices or OS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-1.5 rounded-md border text-sm shadow-sm w-full focus:outline-none focus:ring-2
                ${isDarkMode
                  ? 'bg-[#1F2937] text-white border-[#374151] placeholder-gray-400 focus:ring-blue-500'
                  : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-400 focus:ring-blue-300'}
              `}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="max-h-[25rem] overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[700px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <thead>
                <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
                  <th className="py-2 px-4">Sl No</th>
                  <th className="py-2 px-4">
                    <div className="flex items-center">
                      Operating System
                    </div>
                  </th>
                  <th className="py-2 px-4">Device Name</th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort('type')}>
                    <div className="flex items-center">
                      Device Type
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort('ip')}>
                    <div className="flex items-center">
                      IP/Domain
                      {getSortIcon('ip')}
                    </div>
                  </th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort('uptime')}>
                    <div className="flex items-center">
                      Up Time
                      {getSortIcon('uptime')}
                    </div>
                  </th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map(({ id, os, ip, uptime, isActive, device_name, type }, index) => (
                  <tr
                    key={id}
                    className={`
                      transition-colors cursor-pointer 
                      ${isDarkMode 
                        ? index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900' 
                        : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                      hover:bg-gray-100 dark:hover:bg-gray-700/60
                    `}
                    onClick={() => handleRowClick(id)}
                  >
                    <td className="px-4 py-2">{id}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      {osLogos[os] && <img src={osLogos[os]} alt={os} className="w-5 h-5" />}
                      {os}
                    </td>
                    <td className="px-4 py-2">{device_name}</td>
                    <td className="px-4 py-2">
                      <span className={`font-medium`}>
                        {type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{ip}</td>
                    <td className="px-4 py-2">{uptime}</td>
                    <td className="px-4 py-2">
                      <span className={`font-semibold ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
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

export default DevicesList;
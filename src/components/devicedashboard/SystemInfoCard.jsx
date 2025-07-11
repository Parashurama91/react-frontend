import Windows from "../../assets/Windows_logo.svg";
// System Info Card Component
export const SystemInfoCard = ({ isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 w-80 h-[500px] hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4">
          {/* <windows className="w-6 h-6 text-white"/> */}
            <img src={Windows} alt="Windows Logo" className="w-12 h-12" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>192.168.100.51</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Windows 6.2.9200</p>
        </div>
      </div>
      
      <div className="space-y-5 py-4 ">
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Standard PC (Q35 + ICH9, 2009)</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hardware</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>QEMU Virtual CPU version 2.5+</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Operating System</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Windows 6.2.9200</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cached IP</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>192.168.100.51</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Unknown</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uptime</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>2 days,5h 18m 11s</span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last reboot</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>2025-06-16 09:56:53</span>
        </div>
      </div>
    </div>
  );
};
// import React, { useState } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Notification from '../pages/Notification';

// const Layout = ({
//   children,
//   isDarkMode,
//   toggleTheme,
//   searchQuery,
//   setSearchQuery
// }) => {

//   const [showNotificationModal, setShowNotificationModal] = useState(false);

//   const [notifications, setNotifications] = useState([
//     { id: 1, message: 'High CPU usage on Server 1', read: false },
//     { id: 2, message: 'Disk usage reached 90%', read: false },
//     { id: 3, message: 'New login detected from unknown IP', read: false },
//     { id: 4, message: 'Service restarted on Server 3', read: true },
//     { id: 5, message: 'New update available', read: true },
//     { id: 6, message: 'Memory usage spike on VM-12', read: true },
//     { id: 7, message: 'New login detected from unknown IP', read: false }
//   ]);

//   return (
//     <div className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-[#F0F4FF] text-black'}>
//       <div className="flex min-h-screen">
//         <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
//         <div className="flex-1 flex flex-col">
//           <Header
//             isDarkMode={isDarkMode}
//             toggleTheme={toggleTheme}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             setShowNotificationModal={setShowNotificationModal}
//             notifications={notifications}
//             setNotifications={setNotifications}
//           />
//           <main className="mt-20 ml-64 p-4 overflow-auto">
//             <div className="w-full max-w-[1440px] mx-auto">
//               {children}

//               {/*Show Notification Modal in center */}
//               {showNotificationModal && (
//                 <Notification
//                   isDarkMode={isDarkMode}
//                   notifications={notifications}
//                   onClose={() => setShowNotificationModal(false)}
//                 />
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Notification from '../pages/Notification';

const Layout = ({
  children,
  isDarkMode,
  toggleTheme,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'High CPU usage on Server 1', read: false },
    { id: 2, message: 'Disk usage reached 90%', read: false },
    { id: 3, message: 'New login detected from unknown IP', read: false },
    { id: 4, message: 'Service restarted on Server 3', read: true },
    { id: 5, message: 'New update available', read: true },
    { id: 6, message: 'Memory usage spike on VM-12', read: true },
    { id: 7, message: 'New login detected from unknown IP', read: false },
  ]);

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-[#F0F4FF] text-black'}>
      <div className="flex min-h-screen">
        <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <div className="flex-1 flex flex-col">
          <Header
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowNotificationModal={setShowNotificationModal}
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <main className="mt-20 ml-64 p-4 overflow-auto">
            <div className="w-full max-w-[1440px] mx-auto">
              {children}
            </div>
          </main>

          {showNotificationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
              <Notification
                isDarkMode={isDarkMode}
                notifications={notifications}
                onClose={() => setShowNotificationModal(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;

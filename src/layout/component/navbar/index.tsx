import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Profile from '../profile';
interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const [notifications] = useState(5); // Example notification count

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700" >
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <IconButton
              aria-label="open sidebar"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 text-sm text-white border border-white rounded-full hover:bg-gray-100"
            >
              <MenuIcon  />
            </IconButton>

            <a href="/" className="flex ml-2 md:mr-24">
              <img
                src="https://intra-tools.trrgroup.com/storage/INTRANET/PROD/Asset/Logo_structure/Logo/EN/org_logo_en_light_std.png" //Asset\Logo_structure\logo\EN
                className="h-12 mr-3.5"
                alt="Logo"
              />

            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <div className="flex items-center gap-4">
                <Tooltip title={`${notifications} Notifications`}>
                  <IconButton
                    className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-label="show notifications"
                  >
                    <NotificationsIcon />
                    {notifications > 0 && (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                        {notifications}
                      </div>
                    )}
                  </IconButton>
                </Tooltip>
                <Profile isOpen={isOpen} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Profile from '../profile';
import { useAuth } from '../../../auth/core/AuthContext';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const { userData, logout } = useAuth();
  const currentUser = userData?.[0];
  const [notifications] = useState(5);
  
  // Mock user data - replace with actual user data from your auth context
  // const userData = {
  //   name: "Jakkapob Sirirungsakulwong",
  //   position: "Software Developer",
  //   department: "โรงงานน้ำตาลเชื้อเพลิงปทุมธานี",
  //   company: "บริษัทน้ำตาลไทยรุ่งเรือง จำกัด",
  //   id: "1012286",
  //   dept: "โรงงานน้ำตาลเชื้อเพลิงปทุมธานี",
  //   phone: "02-294-5588",
  //   ext: "1500",
  //   avatar: "/api/placeholder/150/150" // Replace with actual avatar URL
  // };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full" style={{ 
        background: 'white',
        boxShadow: '0 4px 20px rgba(139, 69, 19, 0.3)',
        minHeight: '80px'
      }}>
        <div className="px-6 py-5 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center justify-start">
              <IconButton
                aria-label="open sidebar"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                  color: '#8B4513',
                  border: '1px solid rgba(139, 69, 19, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 69, 19, 0.1)',
                    borderColor: 'rgba(139, 69, 19, 0.5)'
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: '1.6rem' }} />
              </IconButton>

              <a href="/" className="flex ml-6">
                <img
                  src="https://intra-tools.trrgroup.com/storage/INTRANET/PROD/Asset/Logo_structure/Logo/EN/org_logo_en_light_std.png"
                  className="h-14"
                  alt="TRR Logo"
                />
              </a>
            </div>

            <div className="flex items-center gap-5">
              {/* System Label */}
              <div className="hidden md:block">
                <span className="text-white font-medium text-base bg-amber-900 px-5 py-2.5 rounded-full shadow-lg">
                  {currentUser?.application_name}
                </span>
              </div>

              {/* User Info */}
              <div className="hidden md:flex flex-col items-end text-gray-700 mr-4">
                <span className="text-lg font-medium">{currentUser?.employee_fname_en} {currentUser?.employee_lname_en}</span>
                <span className="text-base opacity-70">{currentUser?.employee_position}</span>
              </div>

              {/* Notifications */}
              {/* <Tooltip title={`${notifications} Notifications`}>
                <IconButton
                  sx={{
                    color: '#8B4513',
                    padding: '12px',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.1)'
                    }
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
                  {notifications > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                      {notifications}
                    </div>
                  )}
                </IconButton>
              </Tooltip> */}

              {/* Profile Component */}
              <Profile isOpen={isOpen} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
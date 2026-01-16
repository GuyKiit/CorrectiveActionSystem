import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Profile from '../profile';
import OnlineUsers from './OnlineUsers';
import { useAuth } from '../../../auth/core/AuthContext';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const { userData,infoData, logout } = useAuth();
  const currentUser = userData?.[0];
  const currentInfo = infoData?.[0];
  const [notifications] = useState(5);
  
  const navbarGradient =
    import.meta.env.VITE_NAVBAR_GRADIENT || process.env.REACT_APP_NAVBAR_GRADIENT ||
    'linear-gradient(180deg, #FFFFFF 0%, #B3E5FC 100%)';

  const navbarTextColor =
    import.meta.env.VITE_NAVBAR_TEXT_COLOR || process.env.REACT_APP_NAVBAR_TEXT_COLOR ||
    '#1565C0';

  return (
    <>
      <nav className="fixed top-0 z-50 w-full" style={{ 
        background: navbarGradient,
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.3)',
        // boxShadow: '0 4px 20px rgba(168,168,168,0.3)',
        minHeight: '80px',
        transition: 'background 0.3s ease-in-out'
      }}>
        <div className="px-6 py-5 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center justify-start">
              
              {/* =================================================================================================== */}

              {/* Side Bar Button */}
              <IconButton
                aria-label="open sidebar"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                  color: '#1e293b',
                  borderRadius: '12px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.54))',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: '1.6rem' }} />
              </IconButton>

              {/* =================================================================================================== */}

              {/* Company Logo */}
              <a href="/" className="flex ml-6">
                <img
                  src="https://intra-tools.trrgroup.com/storage/INTRANET/PROD/Asset/Logo_structure/Logo/EN/org_logo_en_light_std.png"
                  className="h-14"
                  alt="TRR Logo"
                />
              </a>

              {/* =================================================================================================== */}

              {/* Application Name & Environment Indicator */}
              <div className="hidden md:block pl-6">
                <span 
                  className="font-medium text-base px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md text-slate-800 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.54))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {currentUser?.application_name}
                  {import.meta.env.VITE_SITE_PATH != 'PROD' && (
                    <span 
                      className={`text-xs font-bold px-3 py-1 rounded-full ml-2 shadow-sm ${
                        import.meta.env.VITE_SITE_PATH === 'DEV' ? 'bg-green-500 text-white' :
                        import.meta.env.VITE_SITE_PATH === 'UAT' ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}
                    >
                      {import.meta.env.VITE_SITE_PATH} Environment
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">

              {/* =================================================================================================== */}



              {/* =================================================================================================== */}

              {/* Online Users */}
              <div className="block">
                <OnlineUsers />
              </div>

              {/* =================================================================================================== */}

              {/* User Info */}
              <div className="hidden md:flex flex-col items-end text-gray-700 mr-4">
                <span className="text-lg font-medium">{currentUser?.employee_fname_en} {currentUser?.employee_lname_en}</span>
                <span className="text-base opacity-70">{userData ? userData[0]?.role_name : ''}</span>
              </div>

              {/* =================================================================================================== */}

              {/* Profile Component */}
              <Profile isOpen={isOpen} />

              {/* =================================================================================================== */}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
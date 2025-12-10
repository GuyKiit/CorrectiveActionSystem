import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Popover, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { _POST_LOG } from '../../../service/mas';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import defaultUserImage from "../../../assets/img/default_user_image.png";
import { useAuth } from '../../../auth/core/AuthContext';

dayjs.extend(relativeTime);

// Helper to replace dayjs relative time abbreviations
const replace_abbre3 = (text: string) => {
  return text
    .replace('a few seconds ago', 'secs ago')
    .replace('a minute ago', 'min ago')
    .replace('an hour ago', 'hr ago')
    .replace('minutes ago', 'mins ago')
    .replace('hours ago', 'hrs ago')
    .replace('a day ago', 'day ago')
    .replace('days ago', 'days ago');
};
const replace_abbre = (val: string) => {
  if (val.indexOf('minute') > -1) {

        return val.replace('minute', 'min');
    } else if (val.indexOf('few second') > -1) {

        return val.replace('a few second', 'sec');
    }

    return val;
};

export default function OnlineUsers() {
  const { userData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDefaultPhoto, setIsDefaultPhoto] = React.useState(false);
  const parseMicrosoftDate = (dateStr: string) => {
    if (!dateStr) return dayjs();
    // Extract timestamp from /Date(1234567890)/
    const match = dateStr.match(/\/Date\((\d+)\)\//);
    if (match && match[1]) {
      return dayjs(parseInt(match[1], 10));
    }
    return dayjs(dateStr);
  };

  const user_current_count = async () => {
    try {
      const dataset = {app_name: import.meta.env.VITE_APP_APPLICATION_CODE || 'CAS'}
      console.log("🚀 [user_current_count] Starting fetch with dataset:", dataset);
      
      const response = await _POST_LOG(
        dataset,
        "/syslog/sys_current_access_count"
        // "http://trr-api.trrgroup.com/api_sys_log/syslog/sys_current_access_count"
      );

      console.log("🔍 [user_current_count] Response:", response);

      response.data.forEach((data: any) => {
        console.log("🔍🔍🔍🔍🔍 [last_update] Response:", data.last_update);
        console.log("📧📧📧📧📧 [email] Response:", data.email);
        console.log("👤👤👤👤👤 [employee_url] Response:", data.employee_url);
      });

      if (response && response.status === "Success") {
        console.log("🍀🍀🍀🍀🍀🍀 CHECK [response] : ", response);
        const mappedUsers = response.data.map((val: any) => ({
          id: val.user_id,
          name: val.user_id, // Or fetch name if available
          role: 'User', // Default or fetch
          avatar: isDefaultPhotoUrl(val.employee_url) ? defaultUserImage : val.employee_url,
          // email: val.email,
          // avatar: isDefaultPhoto ? val.employee_url : defaultUserImage,
          lastSeen: replace_abbre(parseMicrosoftDate(val.last_update).fromNow()),
          status: 'online' // Logic for status?
        }));
        
        // Filter duplicates if needed, similar to legacy code
        const uniqueUsers = mappedUsers.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => (t.id === v.id)) === i);
        console.log("🍀🍀🍀🍀🍀🍀 CHECK [uniqueUsers] : ", uniqueUsers);
        setUsers(uniqueUsers);
      }
    } catch (e) {
      console.error("Error fetching online users:", e);
    }
  };

  const isDefaultPhotoUrl = (url: string) => {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const targetFilename = "nophoto.png";

    const parts = url.split('/');

    const filename = parts[parts.length - 1];

    return filename.toLowerCase() === targetFilename.toLowerCase();
  };

  useEffect(() => {
    user_current_count();
    
    // Optional: Polling every 5 minutes
    const interval = setInterval(user_current_count, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'online-users-popover' : undefined;

  const onlineCount = users.length;

  // Helper to format name like "jakkapob.sir"
  const formatName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].toLowerCase()}.${parts[1].substring(0, 3).toLowerCase()}`;
    }
    return fullName.toLowerCase();
  };

  // Helper to generate consistent colors from strings
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  return (
    <>
      <Tooltip title="View Online Users">
        <Box 
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/40 active:scale-95 group backdrop-blur-md"
          sx={{
            // background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.54))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
          }}
        >
          <PeopleAltOutlinedIcon 
            className="text-gray-600 group-hover:text-blue-600 transition-colors" 
            sx={{ fontSize: '1.4rem' }}
          />
          <Typography className="text-gray-600 font-medium text-sm group-hover:text-blue-600 transition-colors hidden sm:block">
            Online
          </Typography>
          <Box 
            className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full shadow-md ml-1"
          >
            <Typography className="text-white text-xs font-bold">
              {onlineCount}
            </Typography>
          </Box>
        </Box>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: isMobile ? 280 : 300,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <List sx={{ p: 1, maxHeight: 400, overflow: 'auto' }}>
          {users.length > 0 ? (
            users.map((user) => (
              <ListItem 
                key={user.id}
                alignItems="center" 
                className="hover:bg-gray-50 transition-colors cursor-default rounded-lg"
                sx={{ py: 0.75, px: 1 }}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" className="text-gray-500" sx={{ fontSize: '0.75rem' }}>
                      {user.lastSeen}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}></Box>
                    <Tooltip title="Chat on Teams">
                      <IconButton 
                        size="small" 
                        onClick={() => window.open(`https://teams.microsoft.com/l/chat/0/0?users=${user.name.replace(' ', '.').toLowerCase()}@trrgroup.com`, '_blank')}
                        sx={{ 
                          color: '#6264A7', // Microsoft Teams color
                          bgcolor: 'rgba(98, 100, 167, 0.1)',
                          padding: '4px',
                          '&:hover': {
                            bgcolor: 'rgba(98, 100, 167, 0.2)',
                          }
                        }}
                      >
                        <ChatBubbleOutlineIcon sx={{ fontSize: '1rem' }}/>
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 
                          user.status === 'online' ? '#44b700' : 
                          user.status === 'away' ? '#ff9800' : '#bdbdbd',
                        color: 
                          user.status === 'online' ? '#44b700' : 
                          user.status === 'away' ? '#ff9800' : '#bdbdbd',
                        boxShadow: '0 0 0 2px white',
                        width: 8,
                        height: 8,
                        minWidth: 8,
                        '&::after': user.status === 'online' ? {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          animation: 'ripple 1.2s infinite ease-in-out',
                          border: '1px solid currentColor',
                          content: '""',
                        } : {},
                      },
                      '@keyframes ripple': {
                        '0%': {
                          transform: 'scale(.8)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(2.4)',
                          opacity: 0,
                        },
                      },
                    }}
                  >
                    <Avatar 
                      alt={user.name} 
                      src={user.avatar} 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        fontSize: '0.9rem',
                        bgcolor: stringToColor(user.name) 
                      }}
                    >
                      {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#5c6bc0', // Periwinkle blue/purple color
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}
                    >
                      {formatName(user.name)}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: 200,
                color: 'text.secondary'
              }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                No users online
              </Typography>
            </Box>
          )}
        </List>
      </Popover>
    </>
  );
}
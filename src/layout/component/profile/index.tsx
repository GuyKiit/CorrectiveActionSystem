import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuBook from "@mui/icons-material/MenuBook";
import SearchOff from "@mui/icons-material/SearchOff";
import { useAuth } from "../../../auth/core/AuthContext";
import { useNavigate } from "react-router-dom";
import { IconButton, Dialog, DialogContent, Typography, Box, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import defaultUserImage from "../../../assets/img/default_user_image.png";

interface Profile {
  isOpen: boolean;
}

const isDefaultPhotoUrl = (url: string) => {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // Define the target filename we are looking for
    const targetFilename = "nophoto.png";

    // 1. Split the URL path by '/'
    // Example: "http://.../TRRGROUP.COM/nophoto.png" -> ["http:", "", "dev-web.trrgroup.com", "empimage", "TRRGROUP.COM", "nophoto.png"]
    const parts = url.split('/');

    // 2. Get the last part (the filename)
    const filename = parts[parts.length - 1];

    // 3. Compare the extracted filename with the target filename.
    // We convert both to lowercase to handle potential casing differences robustly.
    return filename.toLowerCase() === targetFilename.toLowerCase();
  };

export default function Profile({ isOpen }: Profile) {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = userData?.[0];
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [isDefaultPhoto, setIsDefaultPhoto] = React.useState(false);
  const [manualGuideOpen, setManualGuideOpen] = React.useState(false);
  const manualGuideUrl = null;
  // const manualGuideUrl = "https://intra-tools.trrgroup.com/storage/AVL/PROD/doc_form/TRR-Business-Ethics-for-partners.pdf";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    console.log("#### userData : ", userData?.[0]);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    // navigate('/auth/login');
    handleClose();
  };

  const handleUrlChange = (e: { target: any; }) => {
    const userImageUrl = e.target.value;
  
    // For check default photo
    const isDefault = isDefaultPhotoUrl(userImageUrl);
    
    // Set default photo toggle (Check default photo)
    setIsDefaultPhoto(isDefault); 
  };

  React.useEffect(() => {
    handleUrlChange({ target: { value: currentUser?.employee_image } });
  }, [currentUser?.employee_image]);

  return (
    <>
      <div className={`duration-300 ${isOpen ? 'mr-0' : 'mr-0'}`}>
        <IconButton
          onClick={handleClick}
          sx={{
            padding: '6px',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          {isDefaultPhoto ? <Avatar
            src={defaultUserImage}
            alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
            sx={{
              width: 72,
              height: 72,
              border: '2px solid rgba(139, 69, 19, 0.3)',
              position: 'relative'
            }}
          >
            {currentUser?.employee_fname_en?.charAt(0) || "U"}
          </Avatar>
          : <Avatar
            src={currentUser?.employee_image === null ? defaultUserImage : currentUser?.employee_image}
            alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
            sx={{
              width: 72,
              height: 72,
              border: '2px solid rgba(139, 69, 19, 0.3)',
              position: 'relative'
            }}
          >
            {currentUser?.employee_fname_en?.charAt(0) || "U"}
          </Avatar>}

          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 8px 32px rgba(0,0,0,0.12))',
              mt: 1.5,
              borderRadius: 4,
              minWidth: 280,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: 'none',
                borderRight: 'none',
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(241, 243, 244, 0.8)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isDefaultPhoto ? <Avatar
                src={defaultUserImage}
                alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
                sx={{
                  width: 48, 
                  height: 48,
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {currentUser?.employee_fname_en?.charAt(0) || "U"}
              </Avatar>
              : <Avatar
                src={currentUser?.employee_image === null ? defaultUserImage : currentUser?.employee_image}
                alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
                sx={{
                  width: 72,
                  height: 72,
                  border: '2px solid rgba(139, 69, 19, 0.3)',
                  position: 'relative'
                }}
              >
                {currentUser?.employee_fname_en?.charAt(0) || "U"}
              </Avatar>}

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: '#1f2937',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  {currentUser?.employee_fname_en && currentUser?.employee_lname_en ? 
                    `${currentUser?.employee_fname_en} ${currentUser?.employee_lname_en}` : 
                    currentUser?.employee_username || "User"}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  {currentUser?.employee_email || "user@company.com"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box sx={{ py: 1 }}>
            <MenuItem 
              onClick={handleProfileClick}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                minHeight: 48,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: '#6366f1'
                  },
                  '& .MuiTypography-root': {
                    color: '#6366f1'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: '#6b7280'
              }}>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ 
                fontWeight: 500,
                color: '#374151'
              }}>
                โปรไฟล์
                {/* Profile */}
              </Typography>
            </MenuItem>

            <MenuItem 
              onClick={() => {
                setManualGuideOpen(true);
                handleClose();
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                minHeight: 48,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: '#6366f1'
                  },
                  '& .MuiTypography-root': {
                    color: '#6366f1'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: '#6b7280'
              }}>
                <MenuBook fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ 
                fontWeight: 500,
                color: '#374151'
              }}>
                คู่มือการใช้งาน
                {/* Manual Guide */}
              </Typography>
            </MenuItem>

            <MenuItem 
              onClick={handleLogout}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                minHeight: 48,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: '#ef4444'
                  },
                  '& .MuiTypography-root': {
                    color: '#ef4444'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: '#6b7280'
              }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ 
                fontWeight: 500,
                color: '#374151'
              }}>
                ออกจากระบบ
                {/* Sign Out */}
              </Typography>
            </MenuItem>
          </Box>
        </Menu>
      </div>

      {/* Profile Card Modal */}
      <Dialog
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            maxWidth: '500px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setProfileModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 20,
              top: 20,
              color: '#9ca3af',
              zIndex: 10,
              backgroundColor: 'rgba(248, 249, 250, 0.8)',
              backdropFilter: 'blur(10px)',
              width: 36,
              height: 36,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(229, 231, 235, 0.9)',
                color: '#6b7280'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Profile Card Content */}
          <Box sx={{ p: 4, textAlign: 'center', maxHeight: '90vh', overflow: 'hidden' }}>
            {/* Profile Avatar */}
            <Box sx={{ mb: 3 }}>
              {isDefaultPhoto ? <Avatar
                src={defaultUserImage}
                alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
                sx={{
                  width: 250,
                  height: 250,
                  margin: '0 auto',
                  border: '3px solid rgba(255, 255, 255, 0.6)',
                  borderColor: 'rgba(194, 195, 196, 0.4)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  backgroundColor: 'rgba(249, 250, 251, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {currentUser?.employee_fname_en?.charAt(0) || "U"}
              </Avatar>
              : <Avatar
                src={currentUser?.employee_image === null ? defaultUserImage : currentUser?.employee_image}
                alt={currentUser?.employee_fname_en && currentUser?.employee_lname_en ? currentUser?.employee_fname_en + " " + currentUser?.employee_lname_en : "User"}
                sx={{
                  width: 250,
                  height: 250,
                  margin: '0 auto',
                  border: '3px solid rgba(255, 255, 255, 0.6)',
                  borderColor: 'rgba(194, 195, 196, 0.4)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  backgroundColor: 'rgba(249, 250, 251, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {currentUser?.employee_fname_en?.charAt(0) || "U"}
              </Avatar>}
            </Box>

            {/* User Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#111827', fontSize: '1.4rem' }}>
                {currentUser?.employee_fname_th && currentUser?.employee_lname_th ? 
                  `${currentUser?.employee_fname_th} ${currentUser?.employee_lname_th} (${currentUser?.employee_nickname})` :
                  currentUser?.employee_fname_en && currentUser?.employee_lname_en ?
                  `${currentUser?.employee_fname_en} ${currentUser?.employee_lname_en}` :
                  currentUser?.employee_username || "User"}
                {/* <span style={{ color: '#10b981', marginLeft: '8px', fontSize: '16px' }}>✓</span> */}
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#6b7280', mb: 0.5, fontSize: '0.95rem' }}>
                {currentUser?.employee_position || "Employee"}
              </Typography>
              
              {/* <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                {currentUser?.domain_name || "Company"}
              </Typography> */}
            </Box>

            {/* Detailed Information */}
            <Box sx={{ 
              mb: 0,
              textAlign: 'left',
              background: 'rgba(250, 251, 252, 0.7)',
              backdropFilter: 'blur(15px)',
              borderRadius: 3,
              p: 4,
              border: '1px solid rgba(241, 243, 244, 0.6)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              flex: 1,
              minHeight: '320px'
            }}>
              {/* <Typography variant="h6" sx={{ 
                fontWeight: 500, 
                mb: 3, 
                color: '#374151', 
                textAlign: 'center',
                fontSize: '1.1rem',
                letterSpacing: '0.02em'
              }}>
                Contact Information
              </Typography> */}
              
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                {/* Name */}
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Name
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_fname_en && currentUser?.employee_lname_en ? 
                      `${currentUser?.employee_fname_en} ${currentUser?.employee_lname_en}` : 
                      currentUser?.employee_username || "N/A"}
                  </Typography>
                </Box> */}

                {/* Position */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Position
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_position || "N/A"}
                  </Typography>
                </Box>

                {/* Work Area */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Work Area
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.domain_name || "N/A"}
                  </Typography>
                </Box>

                {/* Company */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Company
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.itasset_company_name || "N/A"}
                  </Typography>
                </Box>

                {/* Employee ID */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Employee ID
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_number || "N/A"}
                  </Typography>
                </Box>
                
                {/* Department */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Department
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.ad_department || "N/A"}
                  </Typography>
                </Box>

                {/* Phone with Ext */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Phone (Ext.)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_tel ? 
                      `${currentUser.employee_tel}${currentUser?.employee_ext ? ` (${currentUser.employee_ext})` : ''}` : 
                      "N/A"}
                  </Typography>
                </Box>

                {/* Mobile */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    Mobile
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_mobile || "N/A"}
                  </Typography>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', minWidth: '120px', fontSize: '0.95rem' }}>
                    E-Mail
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', textAlign: 'right', flex: 1, fontSize: '0.95rem' }}>
                    {currentUser?.employee_email || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>

          </Box>
        </DialogContent>
      </Dialog>

      {/* Manual Guide PDF Modal */}
      <Dialog
        open={manualGuideOpen}
        onClose={() => setManualGuideOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            height: '90vh',
            background: '#fff',
            m: { xs: 1, md: 2, lg: 4 }
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header/Close Button */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              คู่มือการใช้งาน
              {/* Manual Guide */}
            </Typography>
            <IconButton
              onClick={() => setManualGuideOpen(false)}
              sx={{
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                  color: '#111827'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* PDF Iframe or Empty State */}
          <Box sx={{ flex: 1, bgcolor: '#f3f4f6', p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {manualGuideUrl ? (
              <iframe
                src={manualGuideUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Manual Guide PDF"
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <SearchOff sx={{ fontSize: 150, color: '#e5e7eb' }} />
                <br></br>
                <Typography variant="h6" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  ไม่พบคู่มือการใช้งานในระบบ
                  {/* Manual Guide is Empty */}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

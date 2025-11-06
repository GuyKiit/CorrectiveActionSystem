import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SyncIcon from '@mui/icons-material/Sync';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { ReactElement } from 'react';
import { useAuth } from "../../auth/core/AuthContext";

interface ActionManageCellProps {
  disabled?: boolean;
  hiddenRead?: boolean;
  hiddenEdit?: boolean;
  hiddenDelete?: boolean;
  hiddenExplain?: boolean;
  hiddenApproveSC?: boolean;
  hiddenApproveQC?: boolean;
  hiddenClose?: boolean;
  chack_data?: 'Cutoff_Row' | 'CencalCutoff' | undefined;
  hadleOnclickMenu?: (value: string) => void;
}

const ICONS_MAP: { [key: string]: ReactElement } = {
  View: <ZoomInIcon fontSize="medium" />,
  Edit: <EditIcon fontSize="medium" />,
  Delete: <DeleteIcon fontSize="medium" />,
  Print: <LocalPrintshopIcon fontSize="medium" />,
  Sync: <SyncIcon fontSize="medium" />,
  CencalCutoff: <CancelIcon fontSize="medium" />,
  Cutoff_Row: <ContentCutIcon fontSize="medium" />,
};

const ActionManageCell: React.FC<ActionManageCellProps> = (props) => {
  const { disabled, chack_data, hadleOnclickMenu, hiddenRead, hiddenEdit, hiddenDelete, hiddenExplain, hiddenApproveSC, hiddenApproveQC, hiddenClose } = props;
  const { menuFuncData } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

 const renderMenuItem = (
    funcName: string,
    display_name?: string,
    iconElement?: string,
    index?: number,
    hasSubMenu?: boolean,
  ) => (
    <MenuItem
      key={index}
      onClick={() => {
        if (!hasSubMenu) {
          hadleOnclickMenu?.(funcName);
          handleClose(); // ✅ ปิดเมนูหลังเลือก
        }
      }}
      hidden={
        (funcName === "View" && hiddenRead) ||         // Complaint
        (funcName === "Edit" && hiddenRead) ||         // Complaint
        (funcName === "Delete" && hiddenRead) ||       // Complaint
        (funcName === "Explain" && hiddenExplain) ||    // Explain
        (funcName === "ApproveSC" && hiddenApproveSC) ||    // Approve
        (funcName === "ApproveQC" && hiddenApproveQC) ||    // Approve
        (funcName === "Close" && hiddenClose)          // Close
      }
      // onMouseEnter={(e) => {
      //   if (hasSubMenu) {
      //     setSubAnchorEl(e.currentTarget);
      //     setCurrentSubMenu(funcName);
      //   }
      // }}
    >
      <span className="mr-1 min-w-[20px] text-center">
        {iconElement && <i className={`${iconElement} text-base`}></i>}
      </span>
      {display_name || ""}
      {hasSubMenu && <span className="ml-auto">▶</span>}
    </MenuItem>
  );
  console.log(menuFuncData,'menuFuncData');
  console.log(hiddenApproveSC,'hiddenApproveSC');
  console.log(hiddenApproveQC,'hiddenApproveQC');
  
// console.log('CHECK DATE el in ActionManageCell', menuFuncData)
  const filteredMenu = (menuFuncData ?? [])
    .filter(el =>
      el?.func_name && el?.func_name !== "Add" &&
      el.menu_func_sequence !== 0 &&      
      (!chack_data || chack_data === el.func_name)
    )
    .sort((a, b) => (a ? a.menu_func_sequence ?? 9999 : 9999) - (b ? b.menu_func_sequence ?? 9999 : 9999));

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
      >
        <MoreVertIcon style={{ color: 'brown' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 12,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {filteredMenu.map((el: any, index: number) =>

          renderMenuItem(
            el.func_name,
            el.display_name ?? "",
            el.menu_func_icon ?? "",
            index,
            el.children && el.children.length > 0
          )
        )}
      </Menu>
    </div>
  );
};

export default ActionManageCell;

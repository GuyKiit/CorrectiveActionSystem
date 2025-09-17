import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useSelector } from "react-redux";
// import useMediaQuery from "@mui/material";
// import useTheme from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

export interface ProfileDialogCardProps {
  open: boolean;
  onClose: (value: string) => void;
}

export default function ProfileDialogCard(props: ProfileDialogCardProps) {
  const { onClose, open } = props;
  const currentUser = useSelector((state: any) => state?.user?.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerClass = `
    ${isMobile ? "w-full h-[40rem]" : "w-[40rem] h-[50rem]"}
  `;
  const imageClass = `${isMobile ? "w-36 h-36 p-1 rounded-full ring-2 m-5" : "w-80 h-80 p-1 rounded-full ring-2 m-5"}`
  
  return (
    <Dialog onClose={onClose} open={open}>
      <div className={containerClass}>
        <div className="flex items-center justify-center border bg-[#A88D7B] m-3 rounded-lg">
          <img
            className={imageClass}
            src={currentUser?.employee_image}
            alt="Bordered avatar"
          />
        </div>
        <div className="grid grid-cols-1 text-center gap-y-1">
          <label className="text-xl  font-bold">{`${currentUser?.employee_fname_en} ${currentUser?.employee_lname_en}`}</label>
          <label className="text-lg  font-medium">{`${
            currentUser?.employee_fname_th ?? ""
          } ${
            currentUser?.employee_lname_th ?? ""
          } ${
            currentUser?.employee_nickname
              ? `(${currentUser?.employee_nickname})`
              : ""
          }`}</label>
          <label className="text-lg  font-medium">{`${
            currentUser?.employee_position ? currentUser?.employee_position : ""
          }`}</label>
          <label className="text-lg  font-medium">{`${
            currentUser?.itasset_company_name
              ? currentUser?.itasset_company_name
              : ""
          }`}</label>
          <label className="text-lg  font-medium">{`${
            currentUser?.domain_name ? currentUser?.domain_name : ""
          }`}</label>
        </div>
        <div className="mx-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xl  font-bold">ID</label>
            <label className="text-lg  font-medium">{`${currentUser?.employee_number}`}</label>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xl  font-bold">Dept.</label>
            <label className="text-lg  font-medium">{`${
              currentUser?.ad_department ? currentUser?.ad_department : ""
            }`}</label>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xl  font-bold">Phone</label>
            <label className="text-lg  font-medium">{`${
              currentUser?.employee_tel ? currentUser?.employee_tel : "-"
            }`}</label>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xl  font-bold">Ext.</label>
            <label className="text-lg  font-medium">{`${
              currentUser?.employee_ext ? currentUser?.employee_ext : "-"
            }`}</label>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xl  font-bold">Mobile.</label>
            <label className="text-lg  font-medium">{`${
              currentUser?.employee_mobile ? currentUser?.employee_mobile : "-"
            }`}</label>
          </div>
          <div className="flex flex-wrap break-words items-center justify-between">
            <label className="text-xl  font-bold">E-Mail</label>
            <label className="text-lg  font-medium">{`${
              currentUser?.employee_email ? currentUser?.employee_email : "-"
            }`}</label>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

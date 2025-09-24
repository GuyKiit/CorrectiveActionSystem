import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FullWidthButton from "./FullWidthButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface FuncDialog {
  open: boolean;
  handleClose: () => void;
  handlefunction?: () => void;
  handlesavedraft?: () => void;
  titlename?: string;
  dialogWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  openBottonHidden?: boolean;
  colorBotton?: string;
  element?: React.ReactNode;
  modalWidth?: string | number;
  modalHeight?: string | number;
}

export default function FuncDialog(props: FuncDialog) {
  return (
    <BootstrapDialog
      fullWidth
      // maxWidth={props.dialogWidth || "xl"}
      onClose={props.handleClose}
      open={props.open}
      PaperProps={{
        sx: { 
          width: props.modalWidth || "95%", 
          maxWidth: props.modalWidth || "95%",
          height: props.modalHeight || "90vh",
          maxHeight: props.modalHeight || "90vh"
        },
      }}
    >
      {/* Header */}
      <div className="px-5 flex justify-between items-start">
        <div className="pt-5 pb-5">
          <label className="text-2xl sarabun-regular" style={{ fontSize: '18px' }}>
            {props.titlename}
          </label>
        </div>
        <div className="pt-3">
          <IconButton
            aria-label="close"
            onClick={props.handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

      </div>

      {/* Content */}
      {props.element && (
        <DialogContent dividers>{props.element}</DialogContent>
      )}

      {/* Actions */}
      <DialogActions sx={{ justifyContent: "space-between", margin: 2, px: 3, pb: 3 }}>
        {/* Left side - Save Draft */}
        <div>
          {props.openBottonHidden && (
            <FullWidthButton
              handleonClick={props.handlesavedraft ?? props.handleClose}
              labelName= "Save Draft"
              variant_text="contained"
              colorname={props.colorBotton ?? "primary"}
            />
          )}
        </div>
        
        {/* Right side - Save and Submit, Cancel */}
        <div className="flex gap-3">
          
          {props.openBottonHidden && (
            <FullWidthButton
              handleonClick={props.handlefunction ?? props.handleClose}
              labelName={props.titlename ?? "บันทึก"}
              variant_text="contained"
              colorname={props.colorBotton ?? "primary"}
            />
          )}
          <FullWidthButton
            handleonClick={props.handleClose}
            labelName="Cancel"
            variant_text="outlined"
            colorname="inherit"
          />
          
        </div>
      </DialogActions>
    </BootstrapDialog>
  );
}

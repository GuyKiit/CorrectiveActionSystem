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
  titlename?: string;
  dialogWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  openBottonHidden?: boolean;
  colorBotton?: string;
  element?: React.ReactNode;
}

export default function FuncDialog(props: FuncDialog) {
  return (
    <BootstrapDialog
      fullWidth
      // maxWidth={props.dialogWidth || "xl"}
      onClose={props.handleClose}
      open={props.open}
      PaperProps={{
        sx: { width: "100%", maxWidth: "100%" },
      }}
    >
      {/* Header */}
      <div className="px-5 flex justify-between items-start">
        <div className="pt-5 pb-5">
          <label className="text-2xl sarabun-regular">
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
      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 3 }}>
        <div>
          {props.openBottonHidden && (
            <FullWidthButton
              handleonClick={props.handlefunction ?? props.handleClose}
              labelName={props.titlename ?? "บันทึก"}
              variant_text="contained"
              colorname={props.colorBotton ?? "primary"}
            />
          )}
        </div>
        <FullWidthButton
          handleonClick={props.handleClose}
          labelName="Cancel"
          variant_text="outlined"
          colorname="inherit"
        />
      </DialogActions>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
        {/* ปุ่มซ้าย */}
        <div>
          <FullWidthButton
            handleonClick={props.handlefunction ?? props.handleClose}
            labelName="Save Draft"
            variant_text="contained"
            colorname={props.colorBotton ?? "primary"}
          />
        </div>
      </DialogActions>
    </BootstrapDialog>
  );
}

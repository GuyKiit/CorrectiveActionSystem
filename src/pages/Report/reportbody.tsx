import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { cleanAccessData } from "../../service/initmain/initmain";
interface ReportBodyProps {
  mode?: string;
  tempReportParam?: any;
  open: boolean;
  onClose: () => void;
}

export default function ReportBody({ mode,tempReportParam, open, onClose }: ReportBodyProps) {

  const user = cleanAccessData("userSession");
  const REPORT_URL = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
  const ENV = import.meta.env.VITE_SITE_PATH;
  const REPORT_VIEWER = "/Pages/ReportViewer.aspx?";
  let iframeSrc = "";
  let reportTitle = "";
  //-----------------------------------------------------------------------------------------------------------
  if (mode === "complaint_report") {
    const PATH_REPORT = `/Head_office/HQ/CAS/${ENV}/Report/RPT_Complaint_Report`;
    const PARAM_COMPLAINT_ID = `&complaint_id=${tempReportParam?.id}`;
    reportTitle = `พิมพ์เอกสาร : ${tempReportParam?.cas_number}`;

    iframeSrc =
    `${REPORT_URL}` +
    `${REPORT_VIEWER}` +
    `${PATH_REPORT}` +
    `&rs:ClearSession=true` +
    `${PARAM_COMPLAINT_ID}` ;
    
  //-----------------------------------------------------------------------------------------------------------
  
} else {
  const PATH_REPORT = `/Head_office/HQ/CAS/${ENV}/Report/${tempReportParam?.report_code}`;
  const PARAM_COMPANY_ID = `&company_id=${user[0].itasset_company_id}`;
  const PARAM_DOMAIN_ID = `&domain_id=${user[0].employee_domain}`;
  reportTitle = `พิมพ์เอกสาร : ${tempReportParam?.report_name}`;

  iframeSrc =
      `${REPORT_URL}` +
      `${REPORT_VIEWER}` +
      `${PATH_REPORT}` +
      `&rs:ClearSession=true` +
      `${PARAM_COMPANY_ID}` +
      `${PARAM_DOMAIN_ID}`;
    }
    
    //-----------------------------------------------------------------------------------------------------------
    
    const [fullScreen, setFullScreen] = React.useState(false);
    
  return (
    <>
      {/* ===================== Dialog ===================== */}
      <Dialog 
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xl"
        fullScreen={fullScreen}
      >
        <Paper  elevation={6}
          sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}>
        {/* ---------- Header ---------- */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#f5f7fa",
            borderBottom: "1px solid #e0e0e0",
            fontWeight: 600,
          }}
        >
          {reportTitle}

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* ---------- Body ---------- */}
        <DialogContent sx={{ p: 0, height: fullScreen ? "95vh" : "85vh" }}>
          <Box sx={{ width: "100%", height: "100%" }}>
            <iframe
              title="ssrs-report"
              src={iframeSrc}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </Box>
        </DialogContent>
        </Paper>
      </Dialog>
    </>
  );
}



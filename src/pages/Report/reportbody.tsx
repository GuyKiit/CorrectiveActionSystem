// import React from "react";
// // import { _POST } from "../../../service/mas";
 
// interface ReportBody {
 
//   dataelement?: any
 
// }
 
 
// export default function ReportBody({
//   dataelement,
 
// }: ReportBody) {
 
 
 
//   // const VITE_APP_SITE = import.meta.env.VITE_APP_SITE;
//   // const VITE_APP = import.meta.env.VITE_APP;
//   // const VITE_SITE_PATH = import.meta.env.VITE_APP_TRR_URL_PATH;
//   // const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
//   // const ReportViewer = "/Pages/ReportViewer.aspx?/";
//   // const [showIframe, setShowIframe] = React.useState(false);

//   const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
//   const ReportViewer = "/Pages/ReportViewer.aspx?";
//   const REPORT_PATH = `/Head_office/HQ/CAS/DEV/Report/${dataelement?.report_code}`;
//   const [showIframe, setShowIframe] = React.useState(false);
 
//   const preViewReport = async () => {
 
//     if (dataelement) {
//         setTimeout(() => {
//           setShowIframe(true);
//         }, 0.1);
       
//     }
 
//   }
  
// //----------https://trr-rep.trrgroup.com/ReportServer/Pages/ReportViewer.aspx?/SCSS_DEV/DEV/Report/Quota3_Bene
 
//   React.useEffect(() => {
//     preViewReport()
//     console.log(dataelement?.report_code,'sss');
   
//   }, [])
//  const iframeSrc =
//   `${VITE_APP_TRR_API_URL_REPORT}` +
//   `${ReportViewer}` +
//   `${REPORT_PATH}/` +
//   `&rs:ClearSession=true`;

// console.log("📌 iframe src =", iframeSrc);
// console.log("📌 VITE_APP_TRR_API_URL_REPORT =", VITE_APP_TRR_API_URL_REPORT);
// console.log("📌 ReportViewer =", ReportViewer);
// console.log("📌 REPORT_PATH =", REPORT_PATH);
// console.log("📌 dataelement?.report_code =", dataelement?.report_code);
 
//   return (
    
//     <div className="col-12 px-5 h-auto w-auto">
//       {showIframe && (
//         <iframe
//           height="900"
//           width="100%"
//           // src={`${VITE_APP_TRR_API_URL_REPORT}${ReportViewer}${VITE_APP_SITE}/${VITE_APP}/${VITE_SITE_PATH}/Report/${dataelement?.report_code}`}
//           src={ `${VITE_APP_TRR_API_URL_REPORT}` + `${ReportViewer}` + `${REPORT_PATH}` }
//           >
//         </iframe>
//       )}
//     </div>
//   );
// }   


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
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
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
          
          {/* <IconButton onClick={() => setFullScreen(v => !v)}>
              {fullScreen ? (
                <FullscreenExitIcon />
              ) : (
                <FullscreenIcon />
              )}
            </IconButton> */}
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



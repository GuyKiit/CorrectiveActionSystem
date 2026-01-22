import React from "react";
// import { _POST } from "../../../service/mas";
 
interface ReportBody {
 
  dataelement?: any
 
}
 
 
export default function ReportBody({
  dataelement,
 
}: ReportBody) {
 
 
 
  // const VITE_APP_SITE = import.meta.env.VITE_APP_SITE;
  // const VITE_APP = import.meta.env.VITE_APP;
  // const VITE_SITE_PATH = import.meta.env.VITE_APP_TRR_URL_PATH;
  // const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
  // const ReportViewer = "/Pages/ReportViewer.aspx?/";
  // const [showIframe, setShowIframe] = React.useState(false);

  const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
  const ReportViewer = "/Pages/ReportViewer.aspx?";
  const REPORT_PATH = `/Head_office/HQ/CAS/DEV/Report/${dataelement?.report_code}`;
  const [showIframe, setShowIframe] = React.useState(false);
 
  const preViewReport = async () => {
 
    if (dataelement) {
        setTimeout(() => {
          setShowIframe(true);
        }, 0.1);
       
    }
 
  }
  
//----------https://trr-rep.trrgroup.com/ReportServer/Pages/ReportViewer.aspx?/SCSS_DEV/DEV/Report/Quota3_Bene
 
  React.useEffect(() => {
    preViewReport()
    console.log(dataelement?.report_code,'sss');
   
  }, [])
 const iframeSrc =
  `${VITE_APP_TRR_API_URL_REPORT}` +
  `${ReportViewer}` +
  `${REPORT_PATH}/` +
  `&rs:ClearSession=true`;

console.log("📌 iframe src =", iframeSrc);
console.log("📌 VITE_APP_TRR_API_URL_REPORT =", VITE_APP_TRR_API_URL_REPORT);
console.log("📌 ReportViewer =", ReportViewer);
console.log("📌 REPORT_PATH =", REPORT_PATH);
console.log("📌 dataelement?.report_code =", dataelement?.report_code);
 
  return (
    <div className="col-12 px-5 h-auto w-auto">
      {showIframe && (
        <iframe
          height="900"
          width="100%"
          // src={`${VITE_APP_TRR_API_URL_REPORT}${ReportViewer}${VITE_APP_SITE}/${VITE_APP}/${VITE_SITE_PATH}/Report/${dataelement?.report_code}`}
          src={ `${VITE_APP_TRR_API_URL_REPORT}` + `${ReportViewer}` + `${REPORT_PATH}` }
          >
        </iframe>
      )}
    </div>
  );
}   



// // src/config/reportTemplates.ts
// export type FieldConfig = {
//   type: "text" | "textarea" | "date" | "radio" | "checkboxGroup" | "fileUpload";
//   label: string;
//   key: string;
//   options?: string[]; // สำหรับ radio หรือ checkbox
// };

// export type ReportTemplate = {
//   title: string;
//   fields: FieldConfig[];
// };

// export const reportTemplates: Record<string, ReportTemplate> = {
//   NCR: {
//     title: "แบบฟอร์ม NCR",
//     fields: [
//       { type: "text", label: "NCR Number", key: "cas_number" },
//       { type: "text", label: "Factory", key: "request_company_id" },
//       { type: "text", label: "Factory Other", key: "request_company_other" },
//       { type: "date", label: "Document Issue Date", key: "doc_date" },
//       { type: "text", label: "Department / Section", key: "request_position" },
//       { type: "text", label: "Email", key: "request_email" },
//       { type: "checkboxGroup", label: "Type Of Complaint", key: "complaint_type" },
//       { type: "checkboxGroup", label: "Reference Standard", key: "complaint_rs" },
//       { type: "textarea", label: "Description", key: "lot_no" },
//       { type: "text", label: "Lot No./ Bag No.", key: "lot_no" },
//       { type: "date", label: "Respond Within", key: "respond_date_within" },
//       { type: "radio", label: "Priority Level", key: "priority_level", options: ["Emergency","Urgent","Normal"] },
//       { type: "fileUpload", label: "แนบไฟล์", key: "files" },
//       { type: "text", label: "Issue", key: "create_by" },
//       { type: "date", label: "Date", key: "create_datetime" }
//     ]
//   },
//   CAR: {
//     title: "แบบฟอร์ม CAR",
//     fields: [
//       { type: "text", label: "CAR Number", key: "cas_number" },
//       { type: "text", label: "Factory", key: "request_company_id" },
//       { type: "text", label: "Factory Other", key: "request_company_other" },
//       { type: "date", label: "Document Issue Date", key: "doc_date" },
//       { type: "text", label: "Department / Section", key: "request_position" },
//       { type: "text", label: "Email", key: "request_email" },
//       { type: "checkboxGroup", label: "Type Of Complaint", key: "complaint_type" },
//       { type: "textarea", label: "Description", key: "lot_no" },
//       { type: "text", label: "Lot No./ Bag No.", key: "lot_no" },
//       { type: "text", label: "Respond Within", key: "respond_date_within" },
//       { type: "radio", label: "Priority Level", key: "priority_level", options: ["Normal","Urgent"] },
//       { type: "fileUpload", label: "แนบไฟล์", key: "files" },
//       { type: "text", label: "Issue", key: "issue" },
//       { type: "date", label: "Date", key: "date" }
//     ]
//   }
// };
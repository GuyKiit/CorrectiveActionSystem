import React, { createContext, FC, useContext, useState } from "react";
import { initialListComplaint, ListExplainContextProps } from "./model";
import dayjs from "dayjs";
import { setPriority } from "node:os";
type WithChildren = {
    children: React.ReactNode
}
const ListExplainContext = createContext<ListExplainContextProps>(initialListComplaint);
const ListExplainProvider: FC<WithChildren> = ({ children }) => {
    const [Complaint_no, setComplaint_no] = useState<any>(
        initialListComplaint.Complaint_no
    );
    const [no, setno] = useState<any>(
        initialListComplaint.no
    );
    const [cas_number, setcas_number] = useState<any>(
        initialListComplaint.cas_number
    );
    const [doc_date, setdoc_date] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.doc_date)
    );
    const [date_of_detection, setdate_of_detection] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.date_of_detection)
    );
    const [request_name, setrequest_name] = useState<any>(
        initialListComplaint.request_name
    );
    const [request_company_id, setrequest_company_id] = useState<any>(
        initialListComplaint.request_company_id
    );
    const [request_domain_id, setrequest_domain_id] = useState<any>(
        initialListComplaint.request_domain_id
    );
    const [request_department_id, setrequest_department_id] = useState<any>(
        initialListComplaint.request_department_id
    );
    const [request_position, setrequest_position] = useState<any>(
        initialListComplaint.request_position
    );
    const [request_email, setrequest_email] = useState<any>(
        initialListComplaint.request_email
    );
    const [request_date, setrequest_date] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.request_date)
    );
    const [respondent_company_id, setrespondent_company_id] = useState<any>(
        initialListComplaint.respondent_company_id
    );
    const [respondent_domain_id, setrespondent_domain_id] = useState<any>(
        initialListComplaint.respondent_domain_id
    );
    const [respondent_department_id, setrespondent_department_id] = useState<any>(
        initialListComplaint.respondent_department_id
    );
    const [respondent_email, setrespondent_email] = useState<any>(
        initialListComplaint.respondent_email
    );
    const [user_file_name, setuser_file_name] = useState<any>(
        initialListComplaint.user_file_name
    );
    const [area_of_detection_dept, setarea_of_detection_dept] = useState<any>(
        initialListComplaint.area_of_detection_dept
    );
    const [product_name, setproduct_name] = useState<any>(
        initialListComplaint.product_name
    );
    const [detail, setdetail] = useState<any>(
        initialListComplaint.detail
    );
    const [respondent_other_name, setrespondent_other_name] = useState<any>(
        initialListComplaint.respondent_other_name
    );
    const [complaint_type_other, setcomplaint_type_other] = useState<any>(
        initialListComplaint.complaint_type_other
    );
    const [priority_level, setpriority_level] = useState<any>(
        initialListComplaint.priority_level
    );
    const [respondent_other_email, setrespondent_other_email] = useState<any>(
        initialListComplaint.respondent_other_email
    );
    const [respond_date_within, setrespond_date_within] = useState<dayjs.Dayjs | null>(
        dayjs(initialListComplaint.respond_date_within)
    );
    const [lot_no, setlot_no] = useState<any>(
        initialListComplaint.lot_no
    );
    const [reference_standard_other, setreference_standard_other] = useState<any>(
        initialListComplaint.reference_standard_other
    );
    const [acknowledge_flag, setacknowledge_flag] = useState<any>(
        initialListComplaint.acknowledge_flag
    );
    const [acknowledge_name, setacknowledge_name] = useState<any>(
        initialListComplaint.acknowledge_name
    );
    const [acknowledge_company_id, setacknowledge_company_id] = useState<any>(
        initialListComplaint.acknowledge_company_id
    );
    const [acknowledge_department_id, setacknowledge_department_id] = useState<any>(
        initialListComplaint.acknowledge_department_id
    );
    const [acknowledge_position, setacknowledge_position] = useState<any>(
        initialListComplaint.acknowledge_position
    );
    const [acknowledge_email, setacknowledge_email] = useState<any>(
        initialListComplaint.acknowledge_email
    );
    const [acknowledge_datetime, setacknowledge_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.acknowledge_datetime)
    );
    const [complaint_status_id, setcomplaint_status_id] = useState<any>(
        initialListComplaint.complaint_status_id
    );
    const [status_last_datetime, setstatus_last_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.status_last_datetime)
    );
    const [return_from_status_id, setreturn_from_status_id] = useState<any>(
        initialListComplaint.return_from_status_id
    );
    const [return_from_status_datetime, setreturn_from_status_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.return_from_status_datetime)
    );
    const [dc_name, setdc_name] = useState<any>(
        initialListComplaint.dc_name
    );
    const [dc_company_id, setdc_company_id] = useState<any>(
        initialListComplaint.dc_company_id
    );
    const [dc_department_id, setdc_department_id] = useState<any>(
        initialListComplaint.dc_department_id
    );
    const [dc_position, setdc_position] = useState<any>(
        initialListComplaint.dc_position
    );
    const [dc_email, setdc_email] = useState<any>(
        initialListComplaint.dc_email
    );
    // const [dataComplaintType, dataComplaintType] = useState<any>(
    //     initialListComplaint.dataComplaintType
    // );
    const [record_status, setrecord_status] = useState<any>(
        initialListComplaint.record_status
    );
    const [create_by, setcreate_by] = useState<any>(
        initialListComplaint.create_by
    );
    const [create_datetime, setcreate_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.create_datetime)
    );
    const [update_by, setupdate_by] = useState<any>(
        initialListComplaint.update_by
    );
    const [update_datetime, setupdate_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.update_datetime)
    );
    const [ComplaintStatusID_Combobox, setComplaintStatusID_Combobox] = useState<any>(
        initialListComplaint.ComplaintStatusID_Combobox
    );
    const [dataReportType, setdataReportType] = useState<any>(
        initialListComplaint.dataReportType
    );
    const [dataReportTypeValue, setdataReportTypeValue] = useState<any>(
        initialListComplaint.dataReportTypeValue
    );
 
    const [dataComplaintType_Combobox, setdataComplaintType_Combobox] = useState<any>(
        initialListComplaint.dataComplaintType_Combobox
    );
    const [dataComplaintRsValue_Combobox, setdataComplaintRsValue_Combobox] = useState<any>(
        initialListComplaint.dataComplaintRsValue_Combobox
    );
    const [dataComplaintRs_Combobox, setdataComplaintRs_Combobox] = useState<any>(
        initialListComplaint.dataComplaintRs_Combobox
    );
    const [dataphotoValue_Combobox, setdataphotoValue_Combobox] = useState<any>(
        initialListComplaint.dataComplaintRsValue_Combobox
    );
    const [dataphoto_Combobox, setdataphoto_Combobox] = useState<any>(
        initialListComplaint.dataphoto_Combobox
    );
    const [datapriorityValue_Combobox, setdatapriorityValue_Combobox] = useState<any>(
        initialListComplaint.datapriorityValue_Combobox
    );
    const [datapriority_Combobox, setdatapriority_Combobox] = useState<any>(
        initialListComplaint.datapriority_Combobox
    );
    const [datapriority, setdatapriority] = useState<any>(
        initialListComplaint.datapriority
    );
    const [PriorityLevel, setPriorityLevel] = useState<any>(
        initialListComplaint.PriorityLevel
    );
    const [other, setother] = useState<any>(
        initialListComplaint.other
    );
     const [compTypeOther, setcompTypeOther] = useState<any>(
        initialListComplaint.compTypeOther
    );
    const [compRsOther, setcompRsOther] = useState<any>(
        initialListComplaint.compRsOther
    );
    const [photoOther, setphotoOther] = useState<any>(
        initialListComplaint.photoOther
    );
    const [clauseOther, setclauseOther] = useState<any>(
        initialListComplaint.clauseOther
    );
    const [phoTypeOther, setphoTypeOther] = useState<any>(
        initialListComplaint.phoTypeOther
    );
    const [employee_tel, setemployee_tel] = useState<any>(
        initialListComplaint.employee_tel
    );

    

    const [dataComplaintTypeValue_Combobox, setdataComplaintTypeValue_Combobox] =
        useState<any[]>([]); // รับ array ของอะไรก็ได้

    // const [selectedFile, setSelectedFile] = useState<any>(
    //     initialListComplaint.selectedFile
    // );

     

    return (
        <ListExplainContext.Provider
            value={{
                Complaint_no,
                no,
                cas_number,
                doc_date,
                date_of_detection,
                request_name,
                request_company_id,
                request_domain_id,
                request_department_id,
                request_position,
                request_email,
                area_of_detection_dept,
                product_name,
                detail,
                user_file_name,
                other,
                compTypeOther,
                compRsOther,
                photoOther,
                clauseOther,
                phoTypeOther,
                // dataComplaintType,
                request_date,
                respondent_company_id,
                respondent_domain_id,
                respondent_department_id,
                respondent_email,
                respondent_other_name,
                respondent_other_email,
                complaint_type_other,
                priority_level,
                respond_date_within,
                lot_no,
                reference_standard_other,
                acknowledge_flag,
                acknowledge_name,
                acknowledge_company_id,
                acknowledge_department_id,
                acknowledge_position,
                acknowledge_email,
                acknowledge_datetime,
                complaint_status_id,
                status_last_datetime,
                return_from_status_id,
                return_from_status_datetime,
                dc_name,
                dc_company_id,
                dc_department_id,
                dc_position,
                dc_email,
                record_status,
                create_by,
                create_datetime,
                update_by,

                update_datetime,
                ComplaintStatusID_Combobox,
                dataReportType,
                dataReportTypeValue,
                dataComplaintType_Combobox,
                dataComplaintRs_Combobox,
                dataComplaintRsValue_Combobox,
                dataphoto_Combobox,
                dataphotoValue_Combobox,
                datapriority_Combobox,
                datapriorityValue_Combobox,
                datapriority,
                PriorityLevel,
                // ✅ expose state ออกมาให้ component อื่นใช้
                dataComplaintTypeValue_Combobox,

                setComplaint_no,
                setno,
                setcas_number,
                setuser_file_name,
                setdoc_date,
                setdate_of_detection,
                setrequest_name,
                setrequest_company_id,
                setrequest_domain_id,
                setrequest_department_id,
                setrequest_position,
                setrequest_email,
                setother,
                
                // setdataComplaintType,
                setrequest_date,
                setrespondent_company_id,
                setrespondent_domain_id,
                setrespondent_department_id,
                setrespondent_email,
                setarea_of_detection_dept,
                setproduct_name,
                setdetail,
                setcompTypeOther,
                setcompRsOther,
                setphotoOther,
                setclauseOther,
                setphoTypeOther,
                setrespondent_other_name,
                setrespondent_other_email,
                setcomplaint_type_other,
                setpriority_level,
                setrespond_date_within,
                setlot_no,
                setreference_standard_other,
                setacknowledge_flag,
                setacknowledge_name,
                setacknowledge_company_id,
                setacknowledge_department_id,
                setacknowledge_position,
                setacknowledge_email,
                setacknowledge_datetime,
                setcomplaint_status_id,
                setstatus_last_datetime,
                setreturn_from_status_id,
                setreturn_from_status_datetime,
                setdc_name,
                setdc_company_id,
                setdc_department_id,
                setdc_position,
                setdc_email,
                setrecord_status,
                setcreate_by,
                setcreate_datetime,
                setupdate_by,
                setupdate_datetime,
                setComplaintStatusID_Combobox,
                setdataReportType,
                setdataReportTypeValue,
                setdataComplaintType_Combobox,
                setdataComplaintRs_Combobox,
                setdataComplaintRsValue_Combobox,
                setdataphoto_Combobox,
                setdataphotoValue_Combobox,
                setdatapriority_Combobox,
                setdatapriorityValue_Combobox,
                setdatapriority,
                setPriorityLevel,
                setdataComplaintTypeValue_Combobox,
            }}
        >
            {children}
        </ListExplainContext.Provider>
    );
};

const useListExplain = () => useContext(ListExplainContext);
export { ListExplainProvider, useListExplain };



// const [complaintType, setComplaintType] = useState({
//     Complaint_no: initialListComplaint.Complaint_no,
//     no: initialListComplaint.no,
//     complaint_id: initialListComplaint.complaint_id,
//     Complaint_id: initialListComplaint.Complaint_id,
//     record_status: initialListComplaint.record_status,
//     create_by: initialListComplaint.create_by,
//     create_datetime: initialListComplaint.create_datetime
//       ? dayjs(initialListComplaint.create_datetime)
//       : null,
//     update_by: initialListComplaint.update_by,
//     update_datetime: initialListComplaint.update_datetime
//       ? dayjs(initialListComplaint.update_datetime)
//       : null
//   });

//   const value: ListExplainContextProps = {
//     complaintType,
//     setComplaintType
//   };

//   return (
//     <ListExplainContext.Provider value={value}>
//       {children}
//     </ListExplainContext.Provider>
//   );
// };
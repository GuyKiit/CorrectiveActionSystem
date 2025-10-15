import React, { createContext, FC, useContext, useState } from "react";
import { initialListComplaint, ListComplaintContextProps } from "./model";
import dayjs from "dayjs";
import { setPriority } from "node:os";
import { Launch } from "..";
type WithChildren = {
    children: React.ReactNode
}
const ListComplaintContext = createContext<ListComplaintContextProps>(initialListComplaint);
const ListComplaintProvider: FC<WithChildren> = ({ children }) => {
    const [dataelement, setdataelement] = React.useState<any>(initialListComplaint.dataelement);
    const [Complaint_no, setComplaint_no] = useState<any>(
        initialListComplaint.Complaint_no
    );
    const [no, setno] = useState<any>(
        initialListComplaint.no
    );
    const [id, setid] = useState<any>(
        initialListComplaint.id
    );
    const [cas_number, setcas_number] = useState<any>(
        initialListComplaint.cas_number
    );
    const [doc_date, setdoc_date] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.doc_date)
    );
    const [date_of_detection, setdate_of_detection] = useState<dayjs.Dayjs | null>(
        initialListComplaint.date_of_detection ? dayjs(initialListComplaint.date_of_detection) : null
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
    const [request_phone, setrequest_phone] = useState<any>(
        initialListComplaint.request_phone
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
    const [complaint_status_label, setcomplaint_status_label] = useState<any>(
        initialListComplaint.complaint_status_label
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
    const [datastatus, setdatastatus] = useState<any>(
        initialListComplaint.datastatus
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
    const [otherText, setotherText] = useState<any>(
        initialListComplaint.otherText
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
    const [report_type, setreport_type] = useState<any>(
        initialListComplaint.report_type
    );

    //--------dataset-------
    const [dataset_reporttype, setdataset_reporttype] = useState<any>(
        initialListComplaint.dataset_reporttype
    );
    const [dataset_company, setdataset_company] = useState<any>(
        initialListComplaint.dataset_company
    );
    const [dataset_department, setdataset_department] = useState<any>(
        initialListComplaint.dataset_department
    );
    const [dataset_domain, setdataset_domain] = useState<any>(
        initialListComplaint.dataset_domain
    );

    const [dataComplaintTypeValue_Combobox, setdataComplaintTypeValue_Combobox] =
        useState<any[]>([]); // รับ array ของอะไรก็ได้

    // const [selectedFile, setSelectedFile] = useState<any>(
    //     initialListComplaint.selectedFile
    // );
    // State สำหรับเก็บไฟล์จริง
    const [complaintFiles, setcomplaintFiles] = useState<File[]>([]); // state ไฟล์



    //--------Explaint-------
    const [dataTooluse, setdataToolUse] = useState<any>(
        initialListComplaint.dataTooluse
    );
    const [dataToolUse_Combobox, setdataToolUse_Combobox] = useState<any>(
        initialListComplaint.dataToolUse_Combobox
    );
    const [dataTooluseValue, setdataToolUseValue] = useState<any>(
        initialListComplaint.dataTooluseValue
    );
    const [dataToolUseValue_Combobox, setdataToolUseValue_Combobox] = useState<any>(
        initialListComplaint.dataTooluseValue_Combobox
    );
    const [ToolOther, setToolOther] = useState<any>(
        initialListComplaint.ToolOther
    );
    const [dataDecision_Combobox, setdataDecision_Combobox] = useState<any>(
        initialListComplaint.dataDecision_Combobox
    );
    const [dataDecision, setdataDecision] = useState<any>(
        initialListComplaint.dataDecision
    );
    const [dataDecisionValue, setdataDecisionValue] = useState<any>(
        initialListComplaint.dataDecisionValue
    );
    const [DecisionOther, setDecisionOther] = useState<any>(
        initialListComplaint.DecisionOther
    );
    const [dataApprove_Combobox, setdataApprove_Combobox] = useState<any>(
        initialListComplaint.dataApprove_Combobox
    );
    const [dataSectionapp, setdataSectionapp] = useState<any>(
        initialListComplaint.dataSectionapp
    );
    const [dataSectionappValue, setdataSectionappValue] = useState<any>(
        initialListComplaint.dataSectionappValue
    );
    const [dataQcapp, setdataQcapp] = useState<any>(
        initialListComplaint.dataQcapp
    );
    const [dataQcappValue, setdataQcappValue] = useState<any>(
        initialListComplaint.dataQcappValue
    );
    const [dataFuapp, setdataFuapp] = useState<any>(
        initialListComplaint.dataFuapp
    );
    const [dataFuappValue, setdataFuappValue] = useState<any>(
        initialListComplaint.dataFuappValue
    );

    const [explain_id, setexplain_id] = useState<any>(
        initialListComplaint.explain_id
    );
    const [complaint_id, setcomplaint_id] = useState<any>(
        initialListComplaint.complaint_id
    );
    const [explain_seq, setexplain_seq] = useState<any>(
        initialListComplaint.explain_seq
    );
    const [observation_analysis, setobservation_analysis] = useState<any>(
        initialListComplaint.observation_analysis
    );
    const [root_cause, setroot_cause] = useState<any>(
        initialListComplaint.root_cause
    );
    const [corrective_action, setcorrective_action] = useState<any>(
        initialListComplaint.corrective_action
    );
    const [preventive_action_plan, setpreventive_action_plan] = useState<any>(
        initialListComplaint.preventive_action_plan
    );
    const [follow_up_date, setfollow_up_date] = useState<dayjs.Dayjs | null>(
        dayjs(initialListComplaint.follow_up_date)
    );
    const [responsible_name, setresponsible_name] = useState<any>(
        initialListComplaint.responsible_name
    );
    const [responsible_company_id, setresponsible_company_id] = useState<any>(
        initialListComplaint.responsible_company_id
    );
    const [responsible_department_id, setresponsible_department_id] = useState<any>(
        initialListComplaint.responsible_department_id
    );
    const [responsible_position, setresponsible_position] = useState<any>(
        initialListComplaint.responsible_position
    );
    const [responsible_email, setresponsible_email] = useState<any>(
        initialListComplaint.responsible_email
    );
    const [responsible_date, setresponsible_date] = useState<dayjs.Dayjs | null>(
        dayjs(initialListComplaint.responsible_date)
    );
    const [close_status, setclose_status] = useState<any>(
        initialListComplaint.close_status
    );
    const [close_name, setclose_name] = useState<any>(
        initialListComplaint.close_name
    );
    const [close_company_id, setclose_company_id] = useState<any>(
        initialListComplaint.close_company_id
    );
    const [close_department_id, setclose_department_id] = useState<any>(
        initialListComplaint.close_department_id
    );
    const [close_position, setclose_position] = useState<any>(
        initialListComplaint.close_position
    );
    const [close_email, setclose_email] = useState<any>(
        initialListComplaint.close_email
    );
    const [close_date, setclose_date] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.close_date)
    );
    const [return_detail, setreturn_detail] = useState<any>(
        initialListComplaint.return_detail
    );
    const [return_name, setreturn_name] = useState<any>(
        initialListComplaint.return_name
    );
    const [return_company_id, setreturn_company_id] = useState<any>(
        initialListComplaint.return_company_id
    );
    const [return_department_id, setreturn_department_id] = useState<any>(
        initialListComplaint.return_department_id
    );
    const [return_position, setreturn_position] = useState<any>(
        initialListComplaint.return_position
    );
    const [return_email, setreturn_email] = useState<any>(
        initialListComplaint.return_email
    );
    const [return_datetime, setreturn_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.return_datetime)
    );
    const [explain_record_status, setexplain_record_status] = useState<any>(
        initialListComplaint.explain_record_status
    );
    const [explain_create_by, setexplain_create_by] = useState<any>(
        initialListComplaint.explain_create_by
    );
    const [explain_create_datetime, setexplain_create_datetime] = useState<dayjs.Dayjs | null>(
        dayjs(initialListComplaint.explain_create_datetime)
    );
    const [explain_update_by, setexplain_update_by] = useState<any>(
        initialListComplaint.explain_update_by
    );
    const [explain_update_datetime, setexplain_update_datetime] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.explain_update_datetime)
    );

    const [approve_status, setapprove_status] = useState<any>(
        initialListComplaint.approve_status
    );
    const [approve_detail, setapprove_detail] = useState<any>(
        initialListComplaint.approve_detail
    );
    const [approve_note, setapprove_note] = useState<any>(
        initialListComplaint.approve_note
    );
    const [approve_name, setapprove_name] = useState<any>(
        initialListComplaint.approve_name
    );
    const [approve_company_id, setapprove_company_id] = useState<any>(
        initialListComplaint.approve_company_id
    );
    const [approve_department_id, setapprove_department_id] = useState<any>(
        initialListComplaint.approve_department_id
    );
    const [approve_position, setapprove_position] = useState<any>(
        initialListComplaint.approve_position
    );
    const [approve_email, setapprove_email] = useState<any>(
        initialListComplaint.approve_email
    );
    const [approve_date, setapprove_date] = useState<dayjs.Dayjs>(
        dayjs(initialListComplaint.approve_date)
    );
    const [dataset_stepcomplaint, setdataset_stepcomplaint] = useState<any>(
        initialListComplaint.dataset_stepcomplaint
    );
    const [dataset_complaintAction, setdataset_complaintAction] = useState<any>(
        initialListComplaint.setdataset_complaintAction
    );
    const [dataset_complaintActionNew, setdataset_complaintActionNew] = useState<any>(
        initialListComplaint.setdataset_complaintActionNew
    );
    const [dataset_complaintActionExplain, setdataset_complaintActionExplain] = useState<any>(
        initialListComplaint.setdataset_complaintActionExplain
    );
    const [dataset_complaintActionClose, setdataset_complaintActionClose] = useState<any>(
        initialListComplaint.setdataset_complaintActionClose
    );

    return (
        <ListComplaintContext.Provider
            value={{
                dataelement,
                setdataelement,
                Complaint_no,
                no,
                id,
                report_type,
                cas_number,
                doc_date,
                date_of_detection,
                request_name,
                request_company_id,
                request_domain_id,
                request_department_id,
                request_position,
                request_email,
                request_phone,
                product_name,
                detail,
                user_file_name,
                other,
                compTypeOther,
                otherText,
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
                complaint_status_label,
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
                dataReportTypeValue,
                dataComplaintType_Combobox,
                dataComplaintRs_Combobox,
                dataComplaintRsValue_Combobox,
                dataphoto_Combobox,
                dataphotoValue_Combobox,
                datapriority_Combobox,
                datapriorityValue_Combobox,
                datapriority,
                datastatus,
                PriorityLevel,
                // ✅ expose state ออกมาให้ component อื่นใช้
                dataComplaintTypeValue_Combobox,


                //--------dataset-------
                dataset_reporttype,
                dataset_company,
                dataset_department,
                dataset_domain,
                complaintFiles,
                dataset_stepcomplaint,
                dataset_complaintAction,
                dataset_complaintActionNew,
                dataset_complaintActionExplain,
                dataset_complaintActionClose,

                //--------Explaint-------
                dataTooluse,
                dataToolUse_Combobox,
                dataTooluseValue,
                dataToolUseValue_Combobox,
                dataDecision,
                dataDecision_Combobox,
                dataDecisionValue,
                ToolOther,
                DecisionOther,
                dataApprove_Combobox,
                dataSectionapp,
                dataSectionappValue,
                dataQcapp,
                dataQcappValue,
                dataFuapp,
                dataFuappValue,

                explain_id,
                complaint_id,
                explain_seq,
                observation_analysis,
                root_cause,
                corrective_action,
                preventive_action_plan,
                follow_up_date,
                responsible_name,
                responsible_company_id,
                responsible_department_id,
                responsible_position,
                responsible_email,
                responsible_date,
                close_status,
                close_name,
                close_company_id,
                close_department_id,
                close_position,
                close_email,
                close_date,
                return_detail,
                return_name,
                return_company_id,
                return_department_id,
                return_position,
                return_email,
                return_datetime,
                explain_record_status,
                explain_create_by,
                explain_create_datetime,
                explain_update_by,
                explain_update_datetime,

                approve_status,
                approve_detail,
                approve_note,
                approve_name,
                approve_company_id,
                approve_department_id,
                approve_position,
                approve_email,
                approve_date,


                setComplaint_no,
                setno,
                setid,
                setreport_type,
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
                setrequest_phone,
                setother,
                // setdataComplaintType,
                setrequest_date,
                setrespondent_company_id,
                setrespondent_domain_id,
                setrespondent_department_id,
                setrespondent_email,
                setproduct_name,
                setdetail,
                setcompTypeOther,
                setotherText,
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
                setcomplaint_status_label,
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
                setdataReportTypeValue,
                setdataComplaintType_Combobox,
                setdataComplaintRs_Combobox,
                setdataComplaintRsValue_Combobox,
                setdataphoto_Combobox,
                setdataphotoValue_Combobox,
                setdatapriority_Combobox,
                setdatapriorityValue_Combobox,
                setdatapriority,
                setdatastatus,
                setPriorityLevel,
                setdataComplaintTypeValue_Combobox,
                

                //--------dataset-------
                setdataset_reporttype,
                setdataset_company,
                setdataset_department,
                setdataset_domain,
                setcomplaintFiles,
                setdataset_stepcomplaint,
                setdataset_complaintAction,
                setdataset_complaintActionNew,
                setdataset_complaintActionExplain,
                setdataset_complaintActionClose,

                //--------Explaint-------
                setdataToolUse,
                setdataToolUse_Combobox,
                setdataToolUseValue,
                setdataToolUseValue_Combobox,
                setdataDecision_Combobox,
                setdataDecision,
                setdataDecisionValue,
                setToolOther,
                setDecisionOther,
                setdataApprove_Combobox,
                setdataSectionapp,
                setdataSectionappValue,
                setdataQcapp,
                setdataQcappValue,
                setdataFuapp,
                setdataFuappValue,

                setexplain_id,
                setcomplaint_id,
                setexplain_seq,
                setobservation_analysis,
                setroot_cause,
                setcorrective_action,
                setpreventive_action_plan,
                setfollow_up_date,
                setresponsible_name,
                setresponsible_company_id,
                setresponsible_department_id,
                setresponsible_position,
                setresponsible_email,
                setresponsible_date,
                setclose_status,
                setclose_name,
                setclose_company_id,
                setclose_department_id,
                setclose_position,
                setclose_email,
                setclose_date,
                setreturn_detail,
                setreturn_name,
                setreturn_company_id,
                setreturn_department_id,
                setreturn_position,
                setreturn_email,
                setreturn_datetime,
                setexplain_record_status,
                setexplain_create_by,
                setexplain_create_datetime,
                setexplain_update_by,
                setexplain_update_datetime,

                setapprove_status,
                setapprove_detail,
                setapprove_note,
                setapprove_name,
                setapprove_company_id,
                setapprove_department_id,
                setapprove_position,
                setapprove_email,
                setapprove_date,
            }}
        >
            {children}
        </ListComplaintContext.Provider>
    );
};

const useListComplaint = () => useContext(ListComplaintContext);
export { ListComplaintProvider, useListComplaint };

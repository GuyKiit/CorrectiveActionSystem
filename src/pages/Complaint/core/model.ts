import dayjs from "dayjs";
import { SetStateAction, Dispatch } from "react";
import { Launch } from "..";

export type Adds = undefined | null | boolean;

export type ListComplaintContextProps = {  
    // data get ListSearchGet
    dataelement : any
    setdataelement: Dispatch<SetStateAction<any>>;

    Complaint_no?: string
    no?: string
    id?: string
    report_type?: string
    cas_number?: string
    doc_date?: dayjs.Dayjs 
    date_of_detection?: dayjs.Dayjs | null
    request_name?: string | null
    request_company_id?: any
    request_domain_id?: any
    request_department_id?: any
    request_position?: string | null
    request_email?: string | null
    request_phone?: string | null
    request_date?: dayjs.Dayjs
    respondent_company_id?: any
    respondent_domain_id?: any
    respondent_department_id?: any
    respondent_email?: string | null
    product_name?: string | null
    detail?: string | null
    user_file_name?: string | null
    other?: string | null
    // dataComplaintType?: string | null
    respondent_other_name?: string | null
    respondent_other_email?: string | null
    complaint_type_other?: string | null
    priority_level?: string
    respond_date_within?: dayjs.Dayjs | null
    lot_no?: string | null
    reference_standard_other?: string | null
    acknowledge_flag?: boolean
    acknowledge_name?: string | null
    acknowledge_company_id?: number | null
    acknowledge_department_id?: number | null
    acknowledge_position?: string | null
    acknowledge_email?: string | null
    acknowledge_datetime?: dayjs.Dayjs
    complaint_status_id?: string
    complaint_status_label?: string
    step_label?: string
    status_last_datetime?: dayjs.Dayjs
    return_from_status_id?: string
    return_from_status_datetime?: dayjs.Dayjs
    dc_name?: string | null
    dc_company_id?: number | null
    dc_department_id?: number | null
    dc_position?: string | null
    dc_email?: string | null
    record_status?: boolean
    create_by?: string
    create_datetime?: dayjs.Dayjs
    update_by?: string
    update_datetime?: dayjs.Dayjs
    employee_tel?: string
    approve_step?: number | null


    ComplaintStatusID_Combobox?: any
    dataReportTypeValue?: any
    dataComplaintType_Combobox?: any
    dataComplaintTypeValue_Combobox?: any
    dataComplaintRs_Combobox?: any
    dataComplaintRsValue_Combobox?: any
    dataphoto_Combobox?: any
    dataphotoValue_Combobox?: any
    datapriority_Combobox?: any
    datapriorityValue_Combobox?: any
    datapriority?: any
    datastatus?: any
    datastatusconfig?: any
    PriorityLevel?: any
    compTypeOther?: any
    compRsOther?: any
    photoOther?: any
    otherText?: any
    clauseOther?: any
    phoTypeOther?: any

    //--------dataset-------
    dataset_reporttype?: any
    dataset_company?: any
    dataset_department?: any
    dataset_domain?: any
    dataset_domainrelate?: any
    dataset_stepcomplaint?: any
    dataset_complaintAction?: any
    dataset_complaintActionNew?: any
    dataset_complaintActionExplain?: any
    dataset_complaintActionClose?: any
    dataset_activeCompany?: any
    dataset_roleProfile?: any
    domainrelate?: any
    domainrelate_search?: any
    departmentrelate?: any
    departmentrelate_search?: any
    department?: any
    domain?: any

    dataset_complaintActionApproveSC?: any
    dataset_complaintActionApproveQC?: any

    //--------dataset-------
    complaintFiles?: any
    RunningModel?: any

    //--------Explaint-------
    dataTooluse?: any
    dataToolUse_Combobox?: any
    dataTooluse_Combobox?: any
    dataTooluseValue?: any
    dataToolUseValue_Combobox?: any

    dataDecision?: any
    dataDecision_Combobox?: any
    dataDecisionValue?: any
    dataDecisionValue_Combobox?: any
    ToolOther?: any
    DecisionOther?: any
    dataApprove_Combobox?: any
    dataSectionapp?: any
    dataSectionappValue?: any
    dataQcapp?: any
    dataQcappValue?: any
    dataFuapp?: any
    dataFuappValue?: any

    explain_id?: string
    complaint_id?: string
    explain_seq?: number
    observation_analysis?: string
    root_cause?: string
    corrective_action?: string
    preventive_action_plan?: string
    follow_up_date?: dayjs.Dayjs | null
    responsible_name?: string
    responsible_company_id?: any
    responsible_department_id?: any
    responsible_position?: string
    responsible_email?: string
    responsible_date?: dayjs.Dayjs | null
    close_status?: string
    close_name?: string
    close_company_id?: any
    close_department_id?: any
    close_position?: string
    close_email?: string
    close_date?: dayjs.Dayjs | null
    close_detail?: string
    close_note?: string
    return_detail?: string
    return_name?: string
    return_company_id?: any
    return_department_id?: any
    return_position?: string
    return_email?: string
    return_datetime?: dayjs.Dayjs
    explain_record_status?: boolean
    explain_create_by?: string
    explain_create_datetime?: dayjs.Dayjs | null
    explain_update_by?: string
    explain_update_datetime?: dayjs.Dayjs

    //--------Approve-------
    approve_seq?: number
    approve_status?: string
    approve_detail?: string
    approve_note?: string
    approve_name?: string
    approve_company_id?: any
    approve_department_id?: any
    approve_position?: string
    approve_email?: string
    approve_date?: dayjs.Dayjs | null
    apprvove_position?: string
    dataapproveValue_Combobox?: any


    setComplaint_no: Dispatch<SetStateAction<string>>;
    setno: Dispatch<SetStateAction<string>>;
    setid: Dispatch<SetStateAction<string>>;
    setreport_type: Dispatch<SetStateAction<string>>;
    setcas_number: Dispatch<SetStateAction<string>>
    setdoc_date: Dispatch<SetStateAction<dayjs.Dayjs>>
    setdate_of_detection: Dispatch<SetStateAction<dayjs.Dayjs | null>>
    setrequest_name: Dispatch<SetStateAction<string | null>>;
    setrequest_company_id: Dispatch<SetStateAction<number | null>>;
    setrequest_domain_id: Dispatch<SetStateAction<string> | null>;
    setrequest_department_id: Dispatch<SetStateAction<number | null>>;
    setrequest_position: Dispatch<SetStateAction<string | null>>;
    setrequest_email: Dispatch<SetStateAction<string | null>>;
    setrequest_phone: Dispatch<SetStateAction<string | null>>;
    setrequest_date: Dispatch<SetStateAction<dayjs.Dayjs>>
    // setdataComplaintType: Dispatch<SetStateAction<boolean | null>>
    setrespondent_company_id: Dispatch<SetStateAction<number | null>>;
    setrespondent_domain_id: Dispatch<SetStateAction<string | null>>;
    setrespondent_department_id: Dispatch<SetStateAction<number | null>>;
    setrespondent_email: Dispatch<SetStateAction<string | null>>;
    setrespondent_other_name: Dispatch<SetStateAction<string | null>>;
    setrespondent_other_email: Dispatch<SetStateAction<string | null>>;
    setother: Dispatch<SetStateAction<string | null>>;
    setproduct_name: Dispatch<SetStateAction<string | null>>;
    setdetail: Dispatch<SetStateAction<string | null>>;
    setcomplaint_type_other: Dispatch<SetStateAction<string | null>>;
    setpriority_level: Dispatch<SetStateAction<string>>;
    setrespond_date_within: Dispatch<SetStateAction<dayjs.Dayjs | null>>
    setlot_no: Dispatch<SetStateAction<string | null>>;
    setuser_file_name: Dispatch<SetStateAction<string | null>>;
    setreference_standard_other: Dispatch<SetStateAction<string | null>>;
    setacknowledge_flag: Dispatch<SetStateAction<boolean>>;
    setacknowledge_name: Dispatch<SetStateAction<string | null>>;
    setacknowledge_company_id: Dispatch<SetStateAction<number | null>>;
    setacknowledge_department_id: Dispatch<SetStateAction<number | null>>;
    setacknowledge_position: Dispatch<SetStateAction<string | null>>;
    setacknowledge_email: Dispatch<SetStateAction<string | null>>;
    setacknowledge_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    setcomplaint_status_id: Dispatch<SetStateAction<string>>;
    setcomplaint_status_label: Dispatch<SetStateAction<string>>;
    setstep_label: Dispatch<SetStateAction<string>>;
    setstatus_last_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    setreturn_from_status_id: Dispatch<SetStateAction<string>>;
    setreturn_from_status_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    setdc_name: Dispatch<SetStateAction<string | null>>;
    setdc_company_id: Dispatch<SetStateAction<number | null>>;
    setdc_department_id: Dispatch<SetStateAction<number | null>>;
    setdc_position: Dispatch<SetStateAction<string | null>>;
    setcompTypeOther: Dispatch<SetStateAction<string | null>>;
    setcompRsOther: Dispatch<SetStateAction<string | null>>;
    setphotoOther: Dispatch<SetStateAction<string | null>>;
    setotherText: Dispatch<SetStateAction<string | null>>;
    setclauseOther: Dispatch<SetStateAction<string | null>>;
    setphoTypeOther: Dispatch<SetStateAction<string | null>>;
    setdc_email: Dispatch<SetStateAction<string | null>>;
    setrecord_status: Dispatch<SetStateAction<boolean>>
    setcreate_by: Dispatch<SetStateAction<string>>
    setcreate_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    setupdate_by: Dispatch<SetStateAction<string>>
    setupdate_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    


    setComplaintStatusID_Combobox: Dispatch<SetStateAction<any>>
    setdataReportTypeValue: Dispatch<SetStateAction<any>>
    setdataComplaintType_Combobox: Dispatch<SetStateAction<any>>
    setdataComplaintTypeValue_Combobox: Dispatch<SetStateAction<any>>
    setdataComplaintRs_Combobox: Dispatch<SetStateAction<any>>
    setdataComplaintRsValue_Combobox: Dispatch<SetStateAction<any>>
    setdataphoto_Combobox: Dispatch<SetStateAction<any>>
    setdataphotoValue_Combobox: Dispatch<SetStateAction<any>>
    setdatapriority_Combobox: Dispatch<SetStateAction<any>>
    setdatapriorityValue_Combobox: Dispatch<SetStateAction<any>>
    setdatapriority: Dispatch<SetStateAction<any>>
    setdatastatus: Dispatch<SetStateAction<any>>
    setdatastatusconfig: Dispatch<SetStateAction<any>>
    setPriorityLevel: Dispatch<SetStateAction<any>>
    // setSelectedFile: Dispatch<SetStateAction<File>>

    //--------dataset-------
    setdataset_reporttype: Dispatch<SetStateAction<any>>
    setdataset_company: Dispatch<SetStateAction<any>>
    setdataset_department: Dispatch<SetStateAction<any>>
    setdataset_domain: Dispatch<SetStateAction<any>>
    setdataset_domainrelate: Dispatch<SetStateAction<any>>
    setcomplaintFiles: Dispatch<SetStateAction<any>>
    setdataset_stepcomplaint: Dispatch<SetStateAction<any>>
    setdataset_complaintAction: Dispatch<SetStateAction<any>>
    setdataset_complaintActionNew: Dispatch<SetStateAction<any>>
    setdataset_complaintActionExplain: Dispatch<SetStateAction<any>>
    setdataset_complaintActionClose: Dispatch<SetStateAction<any>>
    setdataset_activeCompany: Dispatch<SetStateAction<any>>
    setdataset_roleProfile: Dispatch<SetStateAction<any>>
    set_domainrelate: Dispatch<SetStateAction<any>>;
    set_domainrelate_search: Dispatch<SetStateAction<any>>;
    set_departmentrelate: Dispatch<SetStateAction<any>>;
    set_departmentrelate_search: Dispatch<SetStateAction<any>>;
    set_department: Dispatch<SetStateAction<any>>;
    set_domain: Dispatch<SetStateAction<any>>;

    setdataset_complaintActionApproveSC: Dispatch<SetStateAction<any>>
    setdataset_complaintActionApproveQC: Dispatch<SetStateAction<any>>




    //--------Explaint-------
    setdataToolUse: Dispatch<SetStateAction<any>>
    setdataToolUse_Combobox: Dispatch<SetStateAction<any>>
    setdataToolUseValue: Dispatch<SetStateAction<any>>
    setdataToolUseValue_Combobox: Dispatch<SetStateAction<any>>
    setdataDecision_Combobox: Dispatch<SetStateAction<any>>
    setdataDecision: Dispatch<SetStateAction<any>>
    setdataDecisionValue: Dispatch<SetStateAction<any>>
    setdataDecisionValue_Combobox: Dispatch<SetStateAction<any>>
    setToolOther: Dispatch<SetStateAction<any>>
    setDecisionOther: Dispatch<SetStateAction<any>>
    setdataApprove_Combobox: Dispatch<SetStateAction<any>>
    setdataSectionapp: Dispatch<SetStateAction<any>>
    setdataSectionappValue: Dispatch<SetStateAction<any>>
    setdataQcapp: Dispatch<SetStateAction<any>>
    setdataQcappValue: Dispatch<SetStateAction<any>>
    setdataFuapp: Dispatch<SetStateAction<any>>
    setdataFuappValue: Dispatch<SetStateAction<any>>

    setexplain_id: Dispatch<SetStateAction<string>>;
    setcomplaint_id: Dispatch<SetStateAction<string>>;
    setexplain_seq: Dispatch<SetStateAction<number>>;
    setobservation_analysis: Dispatch<SetStateAction<string>>;
    setroot_cause: Dispatch<SetStateAction<string>>;
    setcorrective_action: Dispatch<SetStateAction<string>>;
    setpreventive_action_plan: Dispatch<SetStateAction<string>>;
    setfollow_up_date: Dispatch<SetStateAction<dayjs.Dayjs | null>>
    setresponsible_name: Dispatch<SetStateAction<string>>;
    setresponsible_company_id: Dispatch<SetStateAction<number>>;
    setresponsible_department_id: Dispatch<SetStateAction<number>>;
    setresponsible_position: Dispatch<SetStateAction<string>>;
    setresponsible_email: Dispatch<SetStateAction<string>>;
    setresponsible_date: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
    setclose_status: Dispatch<SetStateAction<string>>;
    setclose_name: Dispatch<SetStateAction<string>>
    setclose_company_id: Dispatch<SetStateAction<any>>
    setclose_department_id: Dispatch<SetStateAction<any>>
    setclose_position: Dispatch<SetStateAction<string>>
    setclose_email: Dispatch<SetStateAction<string>>
    setclose_date: Dispatch<SetStateAction<dayjs.Dayjs | null>>
    setclose_detail: Dispatch<SetStateAction<string>>
    setclose_note: Dispatch<SetStateAction<string>>
    setreturn_detail: Dispatch<SetStateAction<string>>
    setreturn_name: Dispatch<SetStateAction<string>>
    setreturn_company_id: Dispatch<SetStateAction<number>>
    setreturn_department_id: Dispatch<SetStateAction<number>>
    setreturn_position: Dispatch<SetStateAction<string>>
    setreturn_email: Dispatch<SetStateAction<string>>
    setreturn_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>
    setexplain_record_status: Dispatch<SetStateAction<boolean>>
    setexplain_create_by: Dispatch<SetStateAction<string>>
    setexplain_create_datetime: Dispatch<SetStateAction<dayjs.Dayjs | null>>
    setexplain_update_by: Dispatch<SetStateAction<string>>
    setexplain_update_datetime: Dispatch<SetStateAction<dayjs.Dayjs>>

    setapprove_status: Dispatch<SetStateAction<string>>
    setapprove_detail: Dispatch<SetStateAction<string>>
    setapprove_note: Dispatch<SetStateAction<string>>
    setapprove_name: Dispatch<SetStateAction<string>>
    setapprove_company_id: Dispatch<SetStateAction<number>>
    setapprove_department_id: Dispatch<SetStateAction<any>>
    setapprove_position: Dispatch<SetStateAction<string>>
    setapprove_email: Dispatch<SetStateAction<string>>
    setapprove_date: Dispatch<SetStateAction<dayjs.Dayjs | null>>
};

export const initialListComplaint: ListComplaintContextProps = {
       // data get ListSearchGet
     dataelement :null,
    setdataelement: ()=>{},

    setComplaint_no: () => { },
    setno: () => { },
    setid: () => { },
    setreport_type: () => { },
    setcas_number: () => { },
    setdoc_date: () => { },
    setdate_of_detection: () => { },
    setrequest_name: () => { },
    setrequest_company_id: () => { },
    setrequest_domain_id: () => { },
    setrequest_department_id: () => { },
    setrequest_position: () => { },
    setrequest_email: () => { },
    setrequest_phone: () => { },
    setother: () => { },
    setcompTypeOther: () => { },
    setcompRsOther: () => { },
    setphotoOther: () => { },
    setotherText: () => { },
    setclauseOther: () => { },
    setphoTypeOther: () => { },
    // setdataComplaintType: () => { },
    setrequest_date: () => { },
    setrespondent_company_id: () => { },
    setrespondent_domain_id: () => { },
    setrespondent_department_id: () => { },
    setrespondent_email: () => { },
    setrespondent_other_name: () => { },
    setrespondent_other_email: () => { },
    setproduct_name: () => { },
    setdetail: () => { },
    setcomplaint_type_other: () => { },
    setpriority_level: () => { },
    setrespond_date_within: () => { },
    setlot_no: () => { },
    setuser_file_name: () => { },
    setreference_standard_other: () => { },
    setacknowledge_flag: () => { },
    setacknowledge_name: () => { },
    setacknowledge_company_id: () => { },
    setacknowledge_department_id: () => { },
    setacknowledge_position: () => { },
    setacknowledge_email: () => { },
    setacknowledge_datetime: () => { },
    setcomplaint_status_id: () => { },
    setcomplaint_status_label: () => { },
    setstep_label: () => { },
    setstatus_last_datetime: () => { },
    setreturn_from_status_id: () => { },
    setreturn_from_status_datetime: () => { },
    setdc_name: () => { },
    setdc_company_id: () => { },
    setdc_department_id: () => { },
    setdc_position: () => { },
    setdc_email: () => { },
    setrecord_status: () => { },
    setcreate_by: () => { },
    setcreate_datetime: () => { },
    setupdate_by: () => { },
    setupdate_datetime: () => { },
    setComplaintStatusID_Combobox: () => { },
    setdataReportTypeValue: () => { },
    setdataComplaintType_Combobox: () => { },
    setdataComplaintTypeValue_Combobox: () => { },
    setdataComplaintRs_Combobox: () => { },
    setdataComplaintRsValue_Combobox: () => { },
    setdataphoto_Combobox: () => { },
    setdataphotoValue_Combobox: () => { },
    setdatapriority_Combobox: () => { },
    setdatapriorityValue_Combobox: () => { },
    setdatapriority: () => { },
    setdatastatus: () => { },
    setdatastatusconfig: () => { },
    setPriorityLevel: () => { },

    //--------dataset-------
    setdataset_reporttype: () => { },
    setdataset_company: () => { },
    setdataset_department: () => { },
    setdataset_domain: () => { },
    setdataset_domainrelate: () => { },
    setcomplaintFiles: () => { },
    setdataset_stepcomplaint: () => { },
    setdataset_complaintAction: () => { },
    setdataset_complaintActionNew: () => { },
    setdataset_complaintActionExplain: () => { },
    setdataset_complaintActionClose: () => { },
    setdataset_activeCompany: () => { },
    setdataset_roleProfile: () => { },
    set_domainrelate: () => { },
    set_domainrelate_search: () => { },
    set_departmentrelate: () => { },
    set_departmentrelate_search: () => { },
    set_department: () => { },
    set_domain: () => { },

    setdataset_complaintActionApproveSC: () => { },
    setdataset_complaintActionApproveQC: () => { },








    //--------Explaint-------
    setdataToolUse: () => { },
    setdataToolUse_Combobox: () => { },
    setdataToolUseValue: () => { },
    setdataToolUseValue_Combobox: () => { },
    setdataDecision_Combobox: () => { },
    setdataDecision: () => { },
    setdataDecisionValue: () => { },
    setdataDecisionValue_Combobox: () => { },
    setToolOther: () => { },
    setDecisionOther: () => { },
    setdataApprove_Combobox: () => { },
    setdataSectionapp: () => { },
    setdataSectionappValue: () => { },
    setdataQcapp: () => { },
    setdataQcappValue: () => { },
    setdataFuapp: () => { },
    setdataFuappValue: () => { },

    setexplain_id: () => { },
    setcomplaint_id: () => { },
    setexplain_seq: () => { },
    setobservation_analysis: () => { },
    setroot_cause: () => { },
    setcorrective_action: () => { },
    setpreventive_action_plan: () => { },
    setfollow_up_date: () => { },
    setresponsible_name: () => { },
    setresponsible_company_id: () => { },
    setresponsible_department_id: () => { },
    setresponsible_position: () => { },
    setresponsible_email: () => { },
    setresponsible_date: () => { },
    setclose_status: () => { },
    setclose_name: () => { },
    setclose_company_id: () => { },
    setclose_department_id: () => { },
    setclose_position: () => { },
    setclose_email: () => { },
    setclose_date: () => { },
    setclose_detail: () => { },
    setclose_note: () => { },   

    setreturn_detail: () => { },
    setreturn_name: () => { },
    setreturn_company_id: () => { },
    setreturn_department_id: () => { },
    setreturn_position: () => { },
    setreturn_email: () => { },
    setreturn_datetime: () => { },
    setexplain_record_status: () => { },
    setexplain_create_by: () => { },
    setexplain_create_datetime: () => { },
    setexplain_update_by: () => { },
    setexplain_update_datetime: () => { },

    setapprove_status: () => { },
    setapprove_detail: () => { },
    setapprove_note: () => { },
    setapprove_name: () => { },
    setapprove_company_id: () => { },
    setapprove_department_id: () => {},
    setapprove_position: () => { },
    setapprove_email: () => { },
    setapprove_date: () => { },
};
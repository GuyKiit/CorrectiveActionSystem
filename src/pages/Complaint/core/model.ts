import dayjs from "dayjs";
import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;

export type ListComplaintContextProps = {
    Complaint_no?: string
    no?: string
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
    area_of_detection_dept_id?: string 
    area_of_detection_dept_name?: string 
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
    explain_id?: number | null
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
    PriorityLevel?: any
    compTypeOther?: any
    compRsOther?: any
    photoOther?: any
    clauseOther?: any
    phoTypeOther?: any

    //--------dataset-------
    dataset_reporttype?: any
    dataset_company?: any
    dataset_department?: any
    dataset_domain?: any

    //--------dataset-------
    complaintFiles?: any
    RunningModel?: any

    // dataTruckTypeValue_Combobox?: any
    // dataProduct_Combobox?: any
    // dataProductValue_Combobox?: any
    // dataGroupProduct_Combobox?: any
    // dataGroupProductValue_Combobox?: any
    // dataCompany_Combobox?: any
    // dataCompanyValue_Combobox?: any
    // dataPackUnit_Combobox?: any
    // dataPackUnitValue_Combobox?: any
    // dataCustomer_Combobox?: any
    // dataCustomerValue_Combobox?: any
    // dataCustomerAddress_Combobox?: any
    // dataCustomerAddressValue_Combobox?: any


    // selectedFile?: File


    setComplaint_no: Dispatch<SetStateAction<string>>;
    setno: Dispatch<SetStateAction<string>>;
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
    setarea_of_detection_dept_id: Dispatch<SetStateAction<string | null>>;
    setarea_of_detection_dept_name: Dispatch<SetStateAction<string | null>>;
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
    setPriorityLevel: Dispatch<SetStateAction<any>>
    // setSelectedFile: Dispatch<SetStateAction<File>>

    //--------dataset-------
    setdataset_reporttype: Dispatch<SetStateAction<any>>
    setdataset_company: Dispatch<SetStateAction<any>>
    setdataset_department: Dispatch<SetStateAction<any>>
    setdataset_domain: Dispatch<SetStateAction<any>>
    setcomplaintFiles: Dispatch<SetStateAction<any>>


};

export const initialListComplaint: ListComplaintContextProps = {
    setComplaint_no: () => { },
    setno: () => { },
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
    setarea_of_detection_dept_id: () => { },
    setarea_of_detection_dept_name: () => { },
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
    setPriorityLevel: () => { },

    //--------dataset-------
    setdataset_reporttype: () => { },
    setdataset_company: () => { },
    setdataset_department: () => { },
    setdataset_domain: () => { },
    setcomplaintFiles: () => { },



    // setSelectedFile: () => { }

};
import dayjs from "dayjs";
import { SetStateAction, Dispatch } from "react";
import { Launch } from "..";

export type Adds = undefined | null | boolean;

export type ListDepartmentSettingContextProps = {
    // data get ListSearchGet
    dataelement: any
    setdataelement: Dispatch<SetStateAction<any>>;

    dept_id?: string
    domain_dept_id?: any
    dept_email?: string
    approve_id?: string
    dept_setup_id?: string
    step?: string
    sectionApprove?: any
    qcApprove?: any

    dept_company?: string
    dept_domain?: string
    

    setdept_id: Dispatch<SetStateAction<string>>;
    setdomain_dept_id: Dispatch<SetStateAction<any>>;
    setdept_email: Dispatch<SetStateAction<string>>;
    setapprove_id: Dispatch<SetStateAction<string>>;
    setdept_setup_id: Dispatch<SetStateAction<string>>
    setstep: Dispatch<SetStateAction<string>>;
    setsectionApprove: Dispatch<SetStateAction<any>>;
    setqcApprove: Dispatch<SetStateAction<any>>;

    setdept_company: Dispatch<SetStateAction<string>>;
    setdept_domain: Dispatch<SetStateAction<string>>;

    //--------dataset-------
    dataset_company?: any
    dataset_department?: any
    dataset_domain?: any
    dataset_username?: any

    setdataset_company: Dispatch<SetStateAction<any>>;
    setdataset_department: Dispatch<SetStateAction<any>>;
    setdataset_domain: Dispatch<SetStateAction<any>>;
    setdataset_username: Dispatch<SetStateAction<any>>;

};

export const initialListDepartmentSetting: ListDepartmentSettingContextProps = {
    // data get ListSearchGet
    dataelement: null,
    setdataelement: () => { },

    setdept_id: () => { },
    setdomain_dept_id: () => { },
    setdept_email: () => { },
    setapprove_id: () => { },
    setdept_setup_id: () => { },
    setstep: () => { },
    setsectionApprove: () => { },
    setqcApprove: () => { },

    setdept_company: () => { },
    setdept_domain: () => { },
    //--------dataset-------
    setdataset_company: () => { },
    setdataset_department: () => { },
    setdataset_domain: () => { },
    setdataset_username: () => { },
    // setcomplaintFiles: () => { },
    // setdataset_stepcomplaint: () => { },
    // setdataset_complaintAction: () => { },
    // setdataset_complaintActionNew: () => { },
    // setdataset_complaintActionExplain: () => { },
    // setdataset_complaintActionClose: () => { },




};
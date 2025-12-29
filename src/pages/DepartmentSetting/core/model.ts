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

    dept_company?: any
    dept_domain?: any

    //============================================
    //--------GetMaster(All)-------
    master_domain?: any
    master_department?: any
    master_user?: any

    setmaster_domain: Dispatch<SetStateAction<any>>;
    setmaster_department: Dispatch<SetStateAction<any>>;
    setmaster_user: Dispatch<SetStateAction<any>>;
    //============================================
    

    setdept_id: Dispatch<SetStateAction<string>>;
    setdomain_dept_id: Dispatch<SetStateAction<any>>;
    setdept_email: Dispatch<SetStateAction<string>>;
    setapprove_id: Dispatch<SetStateAction<string>>;
    setdept_setup_id: Dispatch<SetStateAction<string>>
    setstep: Dispatch<SetStateAction<string>>;
    setsectionApprove: Dispatch<SetStateAction<any>>;
    setqcApprove: Dispatch<SetStateAction<any>>;

    setdept_company: Dispatch<SetStateAction<any>>;
    setdept_domain: Dispatch<SetStateAction<any>>;

   

    //--------dataset-------
    company?: any
    department?: any
    domain?: any
    username?: any
    dataset_activeCompany?: any
    dataset_roleProfile?: any
    datastatus?: any
    datastatusconfig?: any
    approveCard?: any
    deptSetupList?: any
    

    company_search?: any
    department_search?: any
    domain_search?: any
    username_search?: any
    

    set_company: Dispatch<SetStateAction<any>>;
    set_department: Dispatch<SetStateAction<any>>;
    set_domain: Dispatch<SetStateAction<any>>;
    set_username: Dispatch<SetStateAction<any>>;
    setdataset_activeCompany: Dispatch<SetStateAction<any>>;
    setdataset_roleProfile: Dispatch<SetStateAction<any>>;
    setdatastatus: Dispatch<SetStateAction<any>>;
    setdatastatusconfig: Dispatch<SetStateAction<any>>;
    setapproveCard: Dispatch<SetStateAction<any>>;
    setDeptSetupList: Dispatch<SetStateAction<any>>;
    

    set_company_search: Dispatch<SetStateAction<any>>;
    set_department_search: Dispatch<SetStateAction<any>>;
    set_domain_search: Dispatch<SetStateAction<any>>;
    set_username_search: Dispatch<SetStateAction<any>>;
    

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
    set_company: () => { },
    set_department: () => { },
    set_domain: () => { },
    set_username: () => { },
    setdataset_activeCompany: () => { },
    setdataset_roleProfile: () => { },
    setdatastatus: () => { },
    setdatastatusconfig: () => { },
    setapproveCard: () => { },
    setDeptSetupList: () => { },
    

    set_company_search: () => { },
    set_department_search: () => { },
    set_domain_search: () => { },
    set_username_search: () => { },
    
    //============================================
    //--------GetMaster(All)-------
    setmaster_domain: () => { },
    setmaster_department: () => { },
    setmaster_user: () => { },
    //============================================


};
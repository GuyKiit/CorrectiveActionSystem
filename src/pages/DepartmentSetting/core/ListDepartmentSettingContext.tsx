import React, { createContext, FC, useContext, useState } from "react";
import { initialListDepartmentSetting, ListDepartmentSettingContextProps } from "./model";
type WithChildren = {
    children: React.ReactNode
}
const ListDepartmentSettingContext = createContext<ListDepartmentSettingContextProps>(initialListDepartmentSetting);
const ListDepartmentSettingProvider: FC<WithChildren> = ({ children }) => {
    const [dataelement, setdataelement] = React.useState<any>(initialListDepartmentSetting.dataelement);
    const [dept_id, setdept_id] = useState<any>(
        initialListDepartmentSetting.dept_id
    );
    const [domain_dept_id, setdomain_dept_id] = useState<any>(
        initialListDepartmentSetting.domain_dept_id
    );
    const [dept_email, setdept_email] = useState<any>(
        initialListDepartmentSetting.dept_email
    );
    const [approve_id, setapprove_id] = useState<any>(
        initialListDepartmentSetting.approve_id
    );
    const [dept_setup_id, setdept_setup_id] = useState<any>(
        initialListDepartmentSetting.dept_setup_id
    );
    const [step, setstep] = useState<any>(
        initialListDepartmentSetting.step
    );
    const [sectionApprove, setsectionApprove] = useState<any>(
        initialListDepartmentSetting.sectionApprove
    );
    const [qcApprove, setqcApprove] = useState<any>(
        initialListDepartmentSetting.qcApprove
    );

    const [dept_company, setdept_company] = useState<any>(
        initialListDepartmentSetting.dept_company
    );
    const [dept_domain, setdept_domain] = useState<any>(
        initialListDepartmentSetting.dept_domain
    );

    //-----------dataset-------------
    const [company, set_company] = useState<any>(
        initialListDepartmentSetting.company
    );
    const [department, set_department] = useState<any>(
        initialListDepartmentSetting.department
    );
    const [domain, set_domain] = useState<any>(
        initialListDepartmentSetting.domain
    );
    const [username, set_username] = useState<any>(
        initialListDepartmentSetting.username
    );

    const [company_search, set_company_search] = useState<any>(
        initialListDepartmentSetting.company_search
    );
    const [department_search, set_department_search] = useState<any>(
        initialListDepartmentSetting.department_search
    );
    const [domain_search, set_domain_search] = useState<any>(
        initialListDepartmentSetting.domain_search
    );
    const [username_search, set_username_search] = useState<any>(
        initialListDepartmentSetting.username_search
    );
    const [dataset_activeCompany, setdataset_activeCompany] = useState<any>(
        initialListDepartmentSetting.dataset_activeCompany
    );
    const [dataset_roleProfile, setdataset_roleProfile] = useState<any>(
        initialListDepartmentSetting.dataset_roleProfile
    );
    const [datastatus, setdatastatus] = useState<any>(
        initialListDepartmentSetting.datastatus
    );
    const [datastatusconfig, setdatastatusconfig] = useState<any>(
        initialListDepartmentSetting.datastatusconfig
    );
    const [approveCard, setapproveCard] = useState<any>(
        initialListDepartmentSetting.approveCard
    );
    const [deptSetupList, setDeptSetupList] = useState<any>(
        initialListDepartmentSetting.deptSetupList
    );

    //============================================
    //--------GetMaster(All)-------
    const [master_domain, setmaster_domain] = useState<any>(
        initialListDepartmentSetting.master_domain
    );
    const [master_department, setmaster_department] = useState<any>(
        initialListDepartmentSetting.master_department
    );
    const [master_user, setmaster_user] = useState<any>(
        initialListDepartmentSetting.master_user
    );
    //============================================


    return (
        <ListDepartmentSettingContext.Provider
            value={{
                dataelement,
                setdataelement,
                dept_id,
                domain_dept_id,
                dept_email,
                approve_id,
                dept_setup_id,
                step,
                sectionApprove,
                qcApprove,

                dept_company,
                dept_domain,

                setdept_id,
                setdomain_dept_id,
                setdept_email,
                setapprove_id,
                setdept_setup_id,
                setstep,
                setsectionApprove,
                setqcApprove,

                setdept_company,
                setdept_domain,


                //-----------dataset-------------
                company,
                department,
                domain,
                username,
                dataset_activeCompany,
                dataset_roleProfile,
                datastatus,
                datastatusconfig,
                approveCard,
                deptSetupList,


                company_search,
                department_search,
                domain_search,
                username_search,


                set_company,
                set_department,
                set_domain,
                set_username,
                setdataset_activeCompany,
                setdataset_roleProfile,
                setdatastatus,
                setdatastatusconfig,
                setapproveCard,
                setDeptSetupList,


                set_company_search,
                set_department_search,
                set_domain_search,
                set_username_search,

                //============================================
                //--------GetMaster(All)-------
                master_domain,
                master_department,
                master_user,
                setmaster_domain,
                setmaster_department,
                setmaster_user, 
                //===========================================
            }}
        >
            {children}
        </ListDepartmentSettingContext.Provider>
    );
};

const useListDepartmentSetting = () => useContext(ListDepartmentSettingContext);
export { ListDepartmentSettingProvider, useListDepartmentSetting };

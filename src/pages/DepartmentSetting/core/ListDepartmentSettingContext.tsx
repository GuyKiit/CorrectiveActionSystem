import React, { createContext, FC, useContext, useState } from "react";
import {  initialListDepartmentSetting, ListDepartmentSettingContextProps } from "./model";
import dayjs from "dayjs";
import { setPriority } from "node:os";
import { Launch } from "..";
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
    const [dataset_company, setdataset_company] = useState<any>(
        initialListDepartmentSetting.dataset_company
    );
    const [dataset_department, setdataset_department] = useState<any>(
        initialListDepartmentSetting.dataset_department
    );
    const [dataset_domain, setdataset_domain] = useState<any>(
        initialListDepartmentSetting.dataset_domain
    );
    const [dataset_username, setdataset_username] = useState<any>(
        initialListDepartmentSetting.dataset_username
    );
    

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
                dataset_company,
                dataset_department,
                dataset_domain,
                dataset_username,
                setdataset_company,
                setdataset_department,
                setdataset_domain,
                setdataset_username,
            }}
        >
            {children}
        </ListDepartmentSettingContext.Provider>
    );
};

const useListDepartmentSetting = () => useContext(ListDepartmentSettingContext);
export { ListDepartmentSettingProvider, useListDepartmentSetting };

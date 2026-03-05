import axios from "axios";
import { _POST, _POST_API_INTRANET } from ".";
import dayjs from "dayjs";
import React from "react";


//===========================================================================================================

// Function - Get Company
export async function mas_CompanyGet(company_id: number, set_company: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

  try {
    const dataset = {
    };
    const response = await _POST(
      dataset,
      "/Complaint/CasCompanyGet"
    );
    if (response && response.status === "success") {
      set_company(response.data);
    }
  } catch (e) {
    console.log("error:", e);
  }
};


export async function mas_DomainGet(company_id: string, set_domain: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

  try {
    // const dataset = {
    //   company_id: company_id,
    // };

    const dataset = {
      domain: user[0]?.employee_domain,
      company_id: company_id,
    };

    const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
    if (response && response.status === "success") {
      if (Array.isArray(response.data)) {

        set_domain(response.data);

      }
    }
  } catch (e) {
    console.log("error:", e);
  }
}

export async function mas_DomainGetAll(setmaster_domain: (data: any) => void, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

  try {
    const dataset = {
    };
    const response = await _POST(dataset, "/Complaint/CasDomainGetAll");
    if (response && response.status === "success") {
      if (Array.isArray(response.data)) {
        // เอา filter ออก → ใช้ทุกตัว
        setmaster_domain(response.data);
      }
    }
  } catch (e) {
    console.log("error:", e);
  }
}

// Function - Get DomainRelate
export async function mas_DomainRelateGet(company_id: any, set_domainrelate: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainRelateGet");

  try {
    const dataset = {
      domain: user[0]?.employee_domain,
      company_id: company_id,
    };

    const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
    if (response && response.status === "success") {
      if (Array.isArray(response.data)) {

        set_domainrelate(response.data);

      }
    }
  } catch (e) {
    console.log("error:", e);
  }
};

export async function mas_DepartmentDomainGet(value: any, set_department: (data: any) => void, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");
  try {
    const dataset = {
      domain_id: value.domain_id,
      company_id: value.company_id,
    };
    const response = await _POST(
      dataset,
      "/Complaint/CasDepartmentDomainGet"
    );
    if (response && response.status === "success") {
      if (Array.isArray(response.data)) {
        // เอา filter ออก → ใช้ทุกตัว
        set_department(response.data);
      }
    }
  } catch (e) {
    console.log("error:", e);
  }
};

export async function mas_DepartmentDomainGetAll(setmaster_department: (data: any) => void, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGetAll");
  try {
    const dataset = {
    };
    const response = await _POST(
      dataset,
      "/Complaint/CasDepartmentDomainGetAll"
    );
    if (response && response.status === "success") {
      if (Array.isArray(response.data)) {
        // เอา filter ออก → ใช้ทุกตัว
        setmaster_department(response.data);
      }
    }
  } catch (e) {
    console.log("error:", e);
  }
};

export async function mas_DepartmentGet_Complaint(value: any, setdataset_department: (data: any) => void, setdataset_department_respondent: (data: any) => void, isCallFuncLogOn: boolean, user: any, action: string) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentGet_Complaint");

  try {
    const dataset = {
      domain_id: value.domain_id,
      company_id: value.company_id ?? user[0]?.itasset_company_id
    };
    const response = await _POST(
      dataset,
      "/Complaint/CasDepartmentDomainGet"
    );
    if (Array.isArray(response.data)) {

      let datasetToSet = response.data;

      if (action === "Add") {
        // ฟิลเตอร์เฉพาะ Add
        datasetToSet = response.data.filter(
          (item: any) => item.department_id != user[0]?.itasset_department_id
        );
      }
      setdataset_department(response.data); // ✅ เรียกทุก action
      setdataset_department_respondent(datasetToSet); // ✅ เรียกทุก action
    }
  } catch (e) {
    console.log("error:", e);
  }
};

// Function - Get Username Domain
export async function mas_UsernameGet(value: any, setUsernameOptions: (data: any) => void, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CasUsernameGet");

  try {
    const dataset = {
      domain_id: value.domain_id,
      company_id: value.company_id,
      department_id: value.department_id,
    };
    const response = await _POST(
      dataset,
      "/Complaint/CasUsernameGet"
    );
    if (response && response.status === "success") {
      // ⭐ map field ให้ CustomMultiSelect รู้จัก
      const mapped = (response.data ?? []).map((u: any) => ({
        ...u,
        id: String(u.employee_id),
        label: `${u.employee_username} (${u.employee_email})`,  // ⭐ สำคัญมาก
        value: `${u.employee_username} (${u.employee_email})`,  // (ถ้า component ใช้)
      }));

      setUsernameOptions(mapped);
    } else {
      setUsernameOptions([]);
    }

  } catch (e) {
    console.log("error:", e);
    setUsernameOptions([]);
  }
};


export async function mas_UsernameGetAll(setmaster_user: (data: any) => void, isCallFuncLogOn: boolean) {
  // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CasUsernameGet");

  try {
    const dataset = {
    };
    const response = await _POST_API_INTRANET(
      dataset,
      "/Employee/Employee_Get"
    );
    if (response && response.status === "Success") {

      // Filter Master User (Only user that have AD only)
      const FilteredData = response.data.filter((val: any) => val['employee_username'] != null);

      setmaster_user(FilteredData);

    }
  } catch (e) {
    console.log("error:", e);
  }
};
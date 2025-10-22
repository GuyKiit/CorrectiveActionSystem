import axios from "axios";
import { _POST } from ".";
import dayjs from "dayjs";

//===========================================================================================================

  // Function - Get Company
  export async function mas_CompanyGet(company_id: number, set_company: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

    try {
      const dataset = {
      };
      const response = await _POST(
        dataset,
        "/Complaint/CasCompanyGet"
      );
      if (response && response.status === "success") {
        console.log(
          "❇️ Call [Complaint/CasCompanyGet] -> Company_Get :",
          response.data
        );
        set_company(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  };


export async function mas_DomainGet(company_id: number, set_domain: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

    try {
      const dataset = {
        company_id: company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainGet");
      if (response && response.status === "success") {
        console.log("❇️ Call [Complaint/CasDomainGet] -> Domain_Get :", response.data);
        if (Array.isArray(response.data)) {
          // เอา filter ออก → ใช้ทุกตัว
          set_domain(response.data);
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
}

 // Function - Get DomainRelate
  export async function mas_DomainRelateGet(value: any, set_domainrelate: (data: any) => void, isCallFuncLogOn: boolean) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainRelateGet");

    try {
      const dataset = {
        domain: value.domain,
        company_id: value.company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
      if (response && response.status === "success") {
        // console.log("❇️ Call [Complaint/CasDomainGet] -> DomainRelateGet :",response.data);
        

        console.log(
          "❇️ Call [Complaint/DomainRelateGet] -> DomainRelateGet :",
          response.data
        );
        if (Array.isArray(response.data)) {
        
            set_domainrelate(response.data);
            // setdataset_company(domain);
          
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

export async function mas_DepartmentDomainGet(value: any, set_department: (data: any) => void, isCallFuncLogOn: boolean) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");

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
        console.log(
          "❇️ Call [Complaint/CasDepartmentDomainGet] -> Department_Domain_Get :",
          response.data
        );
        if (Array.isArray(response.data)) {
          // เอา filter ออก → ใช้ทุกตัว
          set_department(response.data);
        }
        
 
      }
    } catch (e) {
      console.log("error:", e);
    }
  };


export async function mas_DepartmentGet_Complaint(value: any, setdataset_department: (data: any) => void, isCallFuncLogOn: boolean, user:any) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");

    try {
      const dataset = {
        domain_id: value.domain_id,
        company_id: user[0]?.itasset_company_id,
        // company_id: value.company_id,
      };
      const response = await _POST(
        dataset,
        "/Complaint/CasDepartmentDomainGet"
      );
      if (response && response.status === "success") {
        console.log(
          "❇️❇️❇️❇️❇️❇️❇️❇️ Call [Complaint/CasDepartmentDomainGet] -> Department_Domain_Get :",
          response.data
        );
        if (Array.isArray(response.data)) {
          // เอา filter ออก → ใช้ทุกตัว
          setdataset_department(response.data);
        }
        
 
      }
    } catch (e) {
      console.log("error:", e);
    }
  };


   // Function - Get Username Domain
    export async function mas_UsernameGet (value: any, set_username: (data: any) => void,  isCallFuncLogOn: boolean) {
      if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CasUsernameGet");
  
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
          console.log(
            "❇️ Call [Complaint/CasUsernameGet] -> CasUsernameGet :",
            response.data
          );
  
          set_username(response.data);
  
        }
      } catch (e) {
        console.log("error:", e);
      }
    };
  

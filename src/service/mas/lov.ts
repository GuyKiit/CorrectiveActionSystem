import axios from "axios";
import { _POST } from ".";
import dayjs from "dayjs";

//===========================================================================================================

export async function mas_DomainGet(company_id: number, setdataset_domain: (data: any) => void, user: any, isCallFuncLogOn: boolean) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

    try {
      const dataset = {
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainGet");
      if (response && response.status === "success") {
        console.log("❇️ Call [Complaint/CasDomainGet] -> Domain_Get :", response.data);
        if (Array.isArray(response.data)) {
          // เอา filter ออก → ใช้ทุกตัว
          setdataset_domain(response.data);
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
}


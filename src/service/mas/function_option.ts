import axios from "axios";

export function statusOption(status: any){
    if (status === "TEST" || status === "SUBMIT"){
        return true;
    }else{
        return false;
    }
    
}
export async function getDistrict(code: number) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL
        }/MasterData/Districts_Get`;
    const dataset = {
        "DistrictsModel": {
            code: code,
        }
    }
    try {
        const res = await axios.post(url, dataset);
        const data = res.data;
        if (data && data.status == "success") {
            return data.data;
        }
    } catch {
        return false;
    }
}
export async function getSubDistrict(code: number) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL
        }/MasterData/Subdistricts_Get`;
    const dataset = {
        "SubdistrictsModel": {
            "code": code,
        }
    };
    try {
        const res = await axios.post(url, dataset);
        const data = res.data;
        if (data && data.status == "success") {
            return data.data;
        }
    } catch {
        return false;
    }
}

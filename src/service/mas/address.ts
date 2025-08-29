import axios from "axios";

export async function getProvince() {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL
        }/MasterData/Provinces_Get`;
    // console.log(url);
    try {
        const res = await axios.get(url);
        const data = res.data;
        if (data && data.status == "success") {
            return data.data;
        }
    } catch {
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

import axios from "axios";

// export async function getPolicy(id : string) {
//     const url = `${import.meta.env.VITE_APP_TRR_API_URL
//         }/Policy/Policy_Get`;
//         const dataset = {
//             "PolicyModel": {
//                 id: id,
//             }
//         }
//     try {
//         const res = await axios.post(url,dataset);
//         const data = res.data;
        
//         if (data && data.status == "success") {
//             return data.data;
            
//         }
//     } catch {
//         return false;
//     }
// }

// export async function getGroupProduct() {
//     const url = `${import.meta.env.VITE_APP_TRR_API_URL
//         }/Product/Group_Product_Get`;
//     console.log(url);
//     try {
//         const res = await axios.get(url);
//         const data = res.data;
//         if (data && data.status == "success") {
//             return data.data;
//         }
//     } catch {
//         return false;
//     }
// }

import axios from "axios";
import { AuthModel, logintType } from "../../types/users";

// Server should return AuthModel
// export function employee_mockup_get(element: logintType) {
//   const url = `${import.meta.env.VITE_APP_API_URL_EMP_LOGIN}/api_sys_auth/SysAuth/login_auth_emp_get`
//   return axios.post<AuthModel>(url,
//     element
//   );
// }

export async function employee_mockup_get(datasend: any, path: string) {
    const url = `${import.meta.env.VITE_APP_TRRCAS_API_URL
        }${path}`;

    const datasent = {
        ...datasend,
    };

    try {
        const res = await axios.post(url, datasent, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = res.data;
        if (data && data.status == "success") {
            return data;
        } else if (data && data.status == "data_error") {
            return data;
        } else if (data && data.status == "error") {
            return data;
        }
    } catch {
        return false;
    }
}
import axios from "axios";
import { AuthModel, logintType } from "../../types/users";

// Server should return AuthModel
export function login_auth_emp_get(element: logintType) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL_LOGIN}/api_sys_auth/SysAuth/login_auth_emp_get`
    return axios.post<AuthModel>(url, 
      element
    );
  }
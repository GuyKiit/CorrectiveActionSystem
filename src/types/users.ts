export type ID = undefined | null | number;

export type logintType = {
  application_code: string
  employee_username: string,
  password: string,
  client_ip: string,
  access_type: string,
  browser: string,
  version_no: string,
  checkAD: boolean,
  token_id: string,
}

export type AuthModel = {
  data: dataAll;
  error_message: string;
  error_source: string;
  error_stacktrace: string;
  length: number;
  result_datetime: string;
  status: string;
}

export type dataAll = {
  auth_app_info: auth_app_info[];
  auth_role_menu: auth_role_menu[];
  auth_role_menu_func: auth_role_menu_func[];
  auth_role_profile: auth_role_profile[];
};

export type auth_app_info = {
  application_code?: string;
  application_file?: string;
  application_icon?: string;
  application_id?: string;
  application_name?: string;
  application_title?: string;
  application_url?: string;
  auth_type?: string;
  cookie_code?: string;
  cookie_duration?: ID;
  cookie_duration_type?: string;
  cookie_name?: string;
  created_by?: string;
  created_date?: string;
  cookie_detail?: string;
  force_login_flag?: string;
  hits_count?: ID;
  hits_year?: ID;
  intro_detail?: string;
  intro_flag?: string;
  last_update?: string;
  policy_code?: string;
  policy_detail?: string;
  policy_flag?: string;
  record_status?: string;
  suspend_detail?: string;
  suspend_flag?: string;
  updated_by?: string;
  updated_date?: string;
} | undefined;

export type auth_role_menu =
  {
    application_id?: ID;
    menu_icon?: string;
    menu_id?: ID;
    menu_name?: string;
    menu_sequence?: ID;
    menu_sub?: ID;
    menu_url?: string;
    role_id?: ID;
  } | undefined;

export type auth_role_menu_func =
  {
    application_id?: ID;
    func_id?: string;
    func_name?: string;
    funct_oth?: string;
    menu_id?: ID;
    permission?: string | null;
    role_id?: ID;
    role_menu_func_id?: ID;
    menu_func_sequence?: ID;
    display_name?: string | null;
  } | undefined;

export type auth_role_profile =
  {
    Browser?: string | null;
    ad_department?: string | null;
    application_code?: string | null;
    application_id?: ID;
    application_name?: string | null;
    checkAD?: boolean;
    domain_address?: string | null;
    domain_address_eng?: string | null;
    domain_latitude?: ID;
    domain_locataion_url?: string | null;
    domain_longitude?: ID;
    domain_name?: string | null;
    domain_name_eng?: string | null;
    domain_navigate?: string | null;
    e_signature?: string | null;
    employee_domain?: string | null;
    employee_email?: string | null;
    employee_ext?: string | null;
    employee_fname_en?: string | null;
    employee_fname_th?: string | null;
    employee_id?: ID;
    employee_image?: string | undefined | null;
    employee_lname_en?: string | null;
    employee_lname_th?: string | null;
    employee_mobile?: string | null;
    employee_nickname?: string | null;
    employee_number?: string | null;
    employee_position?: string | null;
    employee_tel?: string | null;
    employee_username?: string | null;
    itasset_company_name?: string | null;
    itasset_company_name_eng?: string | null;
    manager_id?: string | null;
    permission?: string | null;
    permission_id?: ID;
    role_id?: ID;
    role_name?: string | null;
    session_id?: string | null;
    token_id?: string | null;
    version_no?: string | null;
  } | undefined;
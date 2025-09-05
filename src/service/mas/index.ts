import axios from "axios";


export async function _GET_APP(datasend:any) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_LOGIN
  }/api_sys_auth/SysApplication/Sys_Application_Get`;
  const datasent = {
    ...datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    return data;
  } catch {
    return false;
  }
}

export async function _GET(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL
  }${path}`;
  
  const datasent = {
    data: datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    if(data && data.status == "success"){
      return data.data;
    }
  } catch {
    return false;
  }
}

export async function _POST(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL
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
    if(data && data.status == "success"){      
      return data;
    }else if (data && data.status == "data_error"){
      return data;
    }else if (data && data.status == "error"){
      return data;
    }
  } catch {
    return false;
  }
}

export async function _POST_FORMDATA(formData: FormData, path: string) {
  const url = `${import.meta.env.VITE_APP_TRR_API_URL}${path}`;

  try {
    const res = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Upload failed", error);
    return false;
  }
}

export async function _POST_SYNC(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_SYNC
  }${path}`;
  
  const datasent = {
    ...datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    if(data && data.status == "success"){
      return data;
    }
  } catch {
    return false;
  }
}

export async function _POST_SYS_API(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_SYS_API_URL
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
    if(data && data.status == "success"){      
      return data;
    }else if (data && data.status == "data_error"){
      return data;
    }else if (data && data.status == "error"){
      return data;
    }
  } catch {
    return false;
  }
}

export async function _GET_ORGREPORT(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_ORGREPORT
  }${path}`;
  
  try {
    const res = await axios.post(url, datasend);
    const data = res.data;
    if(data && data.status == "success"){
      return data.data;
    }
  } catch {
    return false;
  }
}
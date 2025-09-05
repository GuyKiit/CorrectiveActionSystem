import React, { useMemo, useState } from "react";
//import { Divider, Paper, styled } from "@mui/material";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import { _GET, _POST, _POST_FORMDATA, _POST_SYNC } from "../../service/mas";
import { _formatNumber, conCatDateTime } from "../../../libs/datacontrol";
import FuncDialog from "../../components/MUI/FullDialog";
import FullSweetalert from "../../components/MUI/Sweetalert";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import dayjs from "dayjs";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import DesktopDatePickers from "../../components/MUI/DesktopDatePicker";
import BasicChips from "../../components/MUI/BasicChips";
import { Box, Button, Divider, Paper, styled, Typography } from "@mui/material";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import { useAuth } from "../../auth/core/AuthContext";
import EnhancedTable from "../../components/MUI/DataTable";
import Grid from '@mui/material/Grid2';
import { useLayout } from "../../layout/core/LayoutProvider";
import { auth_role_menu_func } from "../../types/users";
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DataTableCollapsible from "../../components/MUI/DataTableCollapsible";
import { useData } from "../../auth/core/DataContext";
import { Complaint_headCells } from "../../../libs/columnname";
import DataTable from "../../components/MUI/DataTable";
import ComplaintInsert from "./components/ComplaintCreate";
import { log } from "node:console";
import { v4 as uuidv4 } from "uuid";
import { cleanAccessData } from "../../service/initmain/initmain";
import CompalintView from "./components/ComplaintRead";
import { useListComplaint } from "./core/ListComplaintContext";

type Launch = {
  id: string
}

interface LovType {
  id: string;
  lov_id: string;
  lov_group: string;
  lov_type: string;
  lov_code: string;
  lov1: string;
};

interface Complaint {
  id: string;
  cas_number: string;
  product_name: string;
}

export default function Complaint() {
  const {

    Complaint_no,
    no,
    cas_number,
    doc_date,
    date_of_detection,
    request_name,
    request_company_id,
    request_domain_id,
    request_department_id,
    request_position,
    request_email,
    request_date,
    respondent_company_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    respondent_other_name,
    respondent_other_email,
    area_of_detection_dept,
    product_name,
    detail,
    compTypeOther,
    compRsOther,
    priority_level,
    respond_date_within,
    lot_no,
    user_file_name,
    acknowledge_flag,
    acknowledge_name,
    acknowledge_company_id,
    acknowledge_department_id,
    acknowledge_position,
    acknowledge_email,
    acknowledge_datetime,
    complaint_status_id,
    status_last_datetime,
    return_from_status_id,
    return_from_status_datetime,
    dc_name,
    dc_company_id,
    dc_department_id,
    dc_position,
    dc_email,
    record_status,
    create_by,
    create_datetime,
    update_by,
    update_datetime,
    ComplaintStatusID_Combobox,
    dataReportType,
    dataReportTypeValue,
    dataComplaintTypeValue_Combobox,
    dataComplaintType_Combobox,
    dataComplaintRsValue_Combobox,
    dataComplaintRs_Combobox,
    dataphotoValue_Combobox,
    dataphoto_Combobox,
    datapriorityValue_Combobox,
    datapriority_Combobox,
    datapriority,
    PriorityLevel,
    clauseOther,
    phoTypeOther,



    setComplaint_no,
    setno,
    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_department_id,
    setrequest_position,
    setrequest_email,
    setuser_file_name,
    setrequest_date,
    setrespondent_company_id,
    setrespondent_domain_id,
    setrespondent_department_id,
    setrespondent_email,
    setrespondent_other_name,
    setrespondent_other_email,
    setarea_of_detection_dept,
    setproduct_name,
    setdetail,
    setcomplaint_type_other,
    setpriority_level,
    setrespond_date_within,
    setlot_no,
    setcompTypeOther,
    setcompRsOther,
    setreference_standard_other,
    setacknowledge_flag,
    setacknowledge_name,
    setacknowledge_company_id,
    setacknowledge_department_id,
    setacknowledge_position,
    setacknowledge_email,
    setacknowledge_datetime,
    setcomplaint_status_id,
    setstatus_last_datetime,
    setreturn_from_status_id,
    setreturn_from_status_datetime,
    setdc_name,
    setdc_company_id,
    setdc_department_id,
    setdc_position,
    setdc_email,
    setrecord_status,
    setcreate_by,
    setcreate_datetime,
    setupdate_by,
    setupdate_datetime,
    setComplaintStatusID_Combobox,
    setdataReportType,
    setdataReportTypeValue,
    setdataComplaintType_Combobox,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRs_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,

    setdatapriorityValue_Combobox,
    setdatapriority_Combobox,
    setdatapriority,
    setPriorityLevel,
    setclauseOther,
    setphoTypeOther,



  } = useListComplaint();

  // Utility Variables ======================================================
  const { setIsLoadingScreen } = useLayout()

  const { menuFuncData, userData } = useAuth()
  const { Customer, ProductGroup, CustomerAddress } = useData()
  const [selectDataTable, setSelectDataTable] = React.useState<any>([])
  const [datalist, setdatalist] = React.useState<any>([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [statusMode, setstatusMode] = React.useState([]);
  const [openSync, setOpenSync] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpLoad, setOpenUpload] = React.useState(false);
  const [dataelement, setdataelement] = React.useState<Launch | null>(null);
  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);

  const [startDateSearch, setStartDateSearch] = React.useState<dayjs.Dayjs | undefined | null>(dayjs().subtract(1, 'month'));
  const [endDateSearch, setEndDateSearch] = React.useState<dayjs.Dayjs | undefined | null>(dayjs().add(3, 'month'));
  const [blockValidateErrors, setBlockValidateErrors] = useState<{ [index: number]: data_detail }>({});

  //------------------Start Search Index ------------------//
  const [TextNameSearch, setTextNameSearch] = React.useState(
    {
      cas_number: "",
      doc_date: "",
      product_name: "",
      lot_no: "",
    }
  );

  // Function Handlers (On Change Event) ======================================================

  const resetForm = () => {
    setcas_number("");
    setarea_of_detection_dept("");
    setproduct_name("");
    setlot_no("");
    setuser_file_name("");
    setdetail("");
    setdatapriority("");
  };

  

  

  //------------Start Get service refresh -------------//
  React.useEffect(() => {
    // allData_Get();
    Complaint_Get();
    ReportType_Get();
    ComplaintType_Get();
    ComplaintRs_Get();
    photo_Get();
    priority_Get();
    //Company_Get();
    //Pack_unit_Get();
  }, []);

  //========================================================================================================

  // const allData_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "report_type,complaint_type,reference_standard,attach_type,priority_level"

  //     }
  //     const response = await _POST(dataset, "/Lov/LovGet");

  //     if (response && response.status === "success") {
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> 3 Data at the same time :", response.data);
        
  //       // Example loop: Iterate over response.data and log each item
  //       // response.data.forEach((item: any, index: any) => {
  //       //   console.log(`Item ${index}:`, item);
  //       //   if (item.lov_type === "report_type") {
  //       //     console.log(`💠 LOOP [report_type] : ${index}:`, item);
  //       //     setdataReportType(item.data);
  //       //   }
  //       //   if (item.lov_type === "complaint_type") {
  //       //     console.log(`💠 LOOP [complaint_type] : ${index}:`, item);
  //       //     setdataComplaintType_Combobox && setdataComplaintType_Combobox(item.data);
  //       //   }
  //       //   if (item.lov_type === "reference_standard") {
  //       //     console.log(`💠 LOOP [reference_standard] : ${index}:`, item);
  //       //     setdataComplaintRs_Combobox && setdataComplaintRs_Combobox(item.data);
  //       //   }
  //       //   if (item.lov_type === "attach_type") {
  //       //     console.log(`💠 LOOP [attach_type] : ${index}:`, item);
  //       //     setdataphoto_Combobox && setdataphoto_Combobox(item.data);
  //       //   }
  //       //   if (item.lov_type === "priority_level") {
  //       //     console.log(`💠 LOOP [priority_level] : ${index}:`, item);
  //       //     setdatapriority_Combobox && setdatapriority_Combobox(item.data);
  //       //   }
  //       // });
        


  //       Array.isArray(response.data) && response.data.forEach((item: any) => {
  //         if (item.lov_type === "report_type") {
  //           setdataReportType(item.data);
  //         }
  //         if (item.lov_type === "complaint_type") {
  //           setdataComplaintType_Combobox && setdataComplaintType_Combobox(item.data);
  //         }
  //         if (item.lov_type === "reference_standard") {
  //           setdataComplaintRs_Combobox && setdataComplaintRs_Combobox(item.data);
  //         }
  //         if (item.lov_type === "attach_type") {
  //           setdataphoto_Combobox && setdataphoto_Combobox(item.data);
  //         }
  //         if (item.lov_type === "priority_level") {
  //           setdatapriority_Combobox && setdatapriority_Combobox(item.data);
  //         }
  //       });
        
  //       // costCenterCode.push(center.cost_center_code)
  //       // center.costCenterId = center.id,
  //       // center.costCenterCode = center.cost_center_code,
  //       // center.costCenterName = center.cost_center_name,
  //       // center.costCentersCodeAndName = "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']' + (center.service_center_flag === true ? ' (Service Center)' : '')
  //       // newData.push(center);



  //       // setdataReportType(response.data);
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> dataReportType :", dataReportType);
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> dataComplaintType_Combobox :", dataComplaintType_Combobox);
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> dataComplaintRs_Combobox :", dataComplaintRs_Combobox);
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> dataphoto_Combobox :", dataphoto_Combobox);
  //       console.log("🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤🧑🏻‍🎤 Call [Lov/LovGet] -> datapriority_Combobox :", datapriority_Combobox);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // }

  //========================================================================================================

  const ReportType_Get = async () => {
    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type: "report_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("⚡️⚡️⚡️⚡️ Call [Lov/LovGet] -> report_type :", response.data);

        setdataReportType(response.data);
        // setdataReportType && setdataReportType(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  //========================================================================================================

  const ComplaintType_Get = async () => {
    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type: "complaint_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("⚡️⚡️⚡️⚡️ Call [Lov/LovGet] -> complaint_type :", response.data);

        setdataComplaintType_Combobox && setdataComplaintType_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  //========================================================================================================

  const ComplaintRs_Get = async () => {
    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type: "reference_standard"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("⚡️⚡️⚡️⚡️ Call [Lov/LovGet] -> reference_standard :", response.data);

        setdataComplaintRs_Combobox && setdataComplaintRs_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  //========================================================================================================

  const photo_Get = async () => {
    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type: "attach_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("⚡️⚡️⚡️⚡️ Call [Lov/LovGet] -> attach_type :", response.data);

        setdataphoto_Combobox && setdataphoto_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  //========================================================================================================

  const priority_Get = async () => {
    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type: "priority_level"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("⚡️⚡️⚡️⚡️ Call [Lov/LovGet] -> priority_level :", response.data);

        setdatapriority_Combobox && setdatapriority_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  //========================================================================================================

  const setData = (data: any) => {



    setcompTypeOther('')
    setComplaint_no('')
    setno('')
    setcas_number('')
  }

  //----------------Call : Complaint_Get -----------------//
  const Complaint_Get = async () => {
    setIsLoadingScreen(true)
    const dataset = {
      cas_number: TextNameSearch.cas_number,
      product_name: TextNameSearch.product_name,
      lot_no: TextNameSearch.lot_no,
      //Complaint_no: Complaint_no ? Complaint_no : null,
      // truck_plate_main: truck_plate_main ? truck_plate_main : null,
      // truck_plate_sub: truck_plate_sub ? truck_plate_sub : null,
      // prod_group_id: dataGroupProductValue_Combobox?.id ? dataGroupProductValue_Combobox.id : null,
      //product_id: dataProductValue_Combobox?.id ? dataProductValue_Combobox.id : null,

    }


    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      console.log(response, "response_Get");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);

        const responseData: any = [];

        if (Array.isArray(response.data)) {
          response.data.forEach((el: any) => {
            const ACTION = (
              <ActionManageCell
                hadleOnclickMenu={(name: any) => {
                  if (name === "View") {
                    handleOnclickMenuView(el);
                  } else if (name === "Edit") {
                    handleOnclickMenuEdit(el);
                  } else if (name === "Delete") {
                    handleOnclickMenuDelete(el);
                  }
                }}
              />
            );

            el.ACTION = ACTION;
            responseData.push(el);
          });
        }

        setdatalist(responseData);

      }

    } catch (e) {
      console.log("error");
    }
  };

  type Block = {
    id: any,
    season: number,
    groupProduct: number,
    prod_id: any,
    customer: any,
    address: any,
    tms_Complaint_no: string,
    order_po: string,
    order_do: string,
    qty: number,
    pack_unit: any,
    total_weight_ton: any,
    note: any,
    isValid: boolean,
    validateMessage: string,
    req: any,
  };

  type data_detail = {
    tms_Complaint_no?: any,
    prod_id?: any,
    order_po?: any,
    cus_id?: any,
    cus_name?: any,
    cus_address_id?: any,
    cus_address?: any,
    order_do?: any,
    pack_unit_id?: any,
    qty?: any,
    total_weight_ton?: any,
    note?: any,
    pack_unit_name?: any,
    req_coa?: any,
    req_example?: any,
  };



  function compTypeUpdateCompId(dataComplaintTypeValue_Combobox: any, complaintid: string, compTypeOther: string) {

    const updatedData = dataComplaintTypeValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: compTypeOther != null && compTypeOther != '' ? compTypeOther : null
      };
    });

    return updatedData;
  }
  function compRsUpdateCompId(dataComplaintRsValue_Combobox: any, complaintid: string, compRsOther: string, clauseOther: string) {

    const updatedData = dataComplaintRsValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: compRsOther != null && compRsOther != '' ? compRsOther : null,
        clause: clauseOther != null && clauseOther != '' ? clauseOther : null
      };
    });

    return updatedData;
  }
  function compFileUpdateCompId(dataphotoValue_Combobox: any, complaintid: string, phoTypeOther: string) {

    const updatedData = dataphotoValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: phoTypeOther != null && phoTypeOther != '' ? phoTypeOther : null
      };
    });

    return updatedData;
  }

  // ----------------Call : Complaint_Add -----------------//
  const Report_Add = async () => {

    console.log("################### TEST UUID DATA :", uuidv4(), "###################");
    console.log("datapriorityValue_Combobox", datapriorityValue_Combobox, "###################");


    var tempid = uuidv4();

    var complainttypeModel
    var complaintRsModel
    var complaintFileModel

    if (dataComplaintTypeValue_Combobox != null) {
      complainttypeModel = compTypeUpdateCompId(dataComplaintTypeValue_Combobox, tempid, compTypeOther);
    }

    if (dataComplaintRsValue_Combobox != null) {
      complaintRsModel = compRsUpdateCompId(dataComplaintRsValue_Combobox, tempid, compRsOther, clauseOther);
    }

    if (dataphotoValue_Combobox != null) {
      complaintFileModel = compFileUpdateCompId(dataphotoValue_Combobox, tempid, phoTypeOther,);
    }

    const dataset = {
      complaintModel: {
        id: tempid,
        cas_number: cas_number,
        //  doc_date: "2025-08-26T14:37:35.707",
        date_of_detection: "2025-08-26T07:37:35.73",

        //User Profile
        request_name: "LKORN",
        request_company_id: 8,
        request_domain_id: "UwD",
        request_department_id: 10,
        request_position: "it",
        request_email: "eBpie@gmail.com",
        request_date: "2025-08-26T14:37:35.707",

        //User Target
        respondent_company_id: 10,
        respondent_domain_id: "mkf",
        respondent_department_id: 3,
        respondent_email: "mqgcW@gmail.com",
        respondent_other_name: "qnN",
        respondent_other_email: "UigEP@gmail.com",

        area_of_detection_dept: area_of_detection_dept,
        product_name: product_name,
        detail: detail,
        priority_level: datapriorityValue_Combobox,
        respond_date_within: "2025-08-26T07:37:35.73",
        lot_no: lot_no,
        complaint_status_id: "TRR_CS_SUBMIT",
        create_by: "Kittiwin",
        action_type: null,
        ComplaintType: complainttypeModel,
        ComplaintRs: complaintRsModel,
        ComplaintFile: complaintFileModel
      },

    }
    console.log(dataset, 'datasetdatasetdataset');
    console.log("newdataaaaaaa", complainttypeModel);
    console.log("newdatRs", complaintRsModel);
    console.log("newdatFilea", complaintFileModel);

    setIsLoadingScreen(true)


    try {
      let response = await await _POST(dataset, "/Complaint/ComplaintAdd");
      if (response && response.status == "success") {
        setIsLoadingScreen(false)

        console.log("dataadd", response.data)
         handleClose?.();
         Complaint_Get();
        // FullSweetalert({
        //   title: 'Success',
        //   text: `จำนวนเพิ่มข้อมูล : ${response.countAddSuccess} รายการ
        //         <br/>
        //         จำนวนอัพเดทข้อมูล ComplaintOrder : ${response.countUpdateSuccess} รายการ
        //         <br/>
        //         จำนวนเพิ่มข้อมูล ComplaintOrder : ${response.countAddOrderSuccess} รายการ
        //   `,
        //   icon: 'success'
        // });

        //=================================================================================

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        // updateSessionStorageCurrentAccess("event_name", "Add/Master_Service_Staff_Add");

        // เตรียมข้อมูลสำหรับใช้ในการ Validate
        // const dataForValidate = {
        //   staffName: resultData.staffName,
        //   staffCode: resultData.staffCode,
        //   costCenter: resultData.costCenter,
        //   staffPosition: resultData.staffPosition,
        //   staffJobType: resultData.staffJobType,
        // };

        // const isValidate = checkValidate(dataForValidate, ["costCenter"]);
        // const isValidateAll = isCheckValidateAll(isValidate);

        // if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
        //   console.log(isValidateAll);
        //   setIsValidate(isValidate);
        //   return;
        // }

        // setIsValidate(null);

        //=================================================================================

      } else {
        setIsLoadingScreen(false)
      }

      //handleClose()
    } catch (e) {
      console.log("error");
      setIsLoadingScreen(false)
    }
  };

  //----------------Call : Complaint_Upload -----------------//
  // const Complaint_Upload = async () => {
  //   if (!selectedFile) {
  //     alert("กรุณาเลือกไฟล์ก่อนอัพโหลด");
  //     return;
  //   }
  //   setIsLoadingScreen(true)

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);
  //   formData.append("ComplaintUploadModel.file", selectedFile);
  //   formData.append("CurrentAccessModel.user_id", userData?.[0]?.employee_username?.toString() ?? "");

  //   try {
  //     let response = await await _POST_FORMDATA(formData, "/Complaint/ComplaintUploadFile");
  //     if (response && response.status == "success") {
  //       setIsLoadingScreen(false)
  //       FullSweetalert({
  //         title: 'Success',
  //         text: `จำนวนเพิ่มข้อมูล : ${response.countAddSuccess} รายการ
  //               <br/>
  //               จำนวนอัพเดทข้อมูล ComplaintOrder : ${response.countUpdateSuccess} รายการ
  //               <br/>
  //               จำนวนเพิ่มข้อมูล ComplaintOrder : ${response.countAddOrderSuccess} รายการ
  //         `,
  //         icon: 'success'
  //       });
  //     }

  //     handleClose()
  //   } catch (e) {
  //     console.log("error");
  //   }
  // };
  
  // Function Handlers (On Click Event) ======================================================
  const handleOnclickMenuSync = () => {
    setOpenSync(true);
  };
  const handleOnclickMenuAdd = () => {
    resetForm();
    setOpenAdd(true);
  };
  const handleOnclickMenuView = (data: any) => {
    resetForm();
    setOpenView(true);
    setdataelement(data);
  };
  const handleOnclickMenuEdit = (data: any) => {
    resetForm();
    setOpenEdit(true);
    setdataelement(data);
  };
  const handleOnclickMenuDelete = (data: any) => {
    resetForm();
    setOpenDelete(true);
    setdataelement(data);
  };
  // const hadleOnclickMenuPrint = (data: any) => {
  //   Complaint_Print(data);
  // };
  const handleOnclickMenuUpload = () => {
    setOpenUpload(true);
  };

  const handleTableButtonClick = (func_name: string) => {
    switch (func_name) {
      case 'Add':
        handleOnclickMenuAdd();
        break;
      case 'Upload':
        handleOnclickMenuUpload();
        break;
      case 'Print':
        console.log("Print clicked");
        break;
      default:
        console.warn("No handler for", func_name);
    }
  };


  const handleCloseSearch = () => {
    setdataReportTypeValue("");
    setdataComplaintTypeValue_Combobox("");
    setdataComplaintRsValue_Combobox("");
    setdataphotoValue_Combobox("");
    setTextNameSearch({
      cas_number: "",
      doc_date: "",
      product_name: "",
      lot_no: "",
    });

    // โหลดข้อมูลใหม่ทั้งหมด
    Complaint_Get();
  };


  const handleClose = () => {
    setOpenAdd(false);
    setOpenSync(false);
    setOpenView(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenUpload(false);
    // setDataCompanyValue_Combobox(null);

  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          mb: 2,
          border: '2px solid #F29739',
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <div className="px-2 pt-2 pb-5">
          <label className="sarabun-regular-datatable">
            ค้นหา
          </label>
        </div>
        <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
        <Grid container spacing={2} mt={2}>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.cas_number}
              labelName={"CAS Number"}
              onchange={(value) => setTextNameSearch({ ...TextNameSearch, ...{ cas_number: value } })}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={dataComplaintTypeValue_Combobox}
              labelName={"ComplaintType"}
              options={dataComplaintType_Combobox}
              column="lov1"
              setvalue={setdataComplaintTypeValue_Combobox}
            //disabled={false}
            />
          </Grid>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.product_name}
              labelName={"ชื่อสินค้า (Product Name)"}
              onchange={(value) => setTextNameSearch({ ...TextNameSearch, ...{ product_name: value } })}
            //disabled={false}
            />
          </Grid>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.lot_no}
              labelName={"Lot No./Bag No"}
              onchange={(value) => setTextNameSearch({ ...TextNameSearch, ...{ lot_no: value } })}
            //disabled={false}
            />
          </Grid>
          {/* <Grid size={4}>
          <FullWidthTextField
            value={TextNameSearch.respond_search}
            labelName={"Respond Within"}
            onchange={(value) => setTextNameSearch({ ...TextNameSearch, ...{ respond_search: value } })}
          />
        </Grid> */}
          <Grid size={4}>
            <AutocompleteComboBox
              value={selectDataTable}
              labelName={"Status"}
              options={selectDataTable}
              column="name_th"
              setvalue={setSelectDataTable}
            //disabled={false}
            />
          </Grid>
          <Grid size={4}>
            <DesktopDatePickers
              labelName={"Respond Within"}
              value={startDateSearch}
              handleChange={setStartDateSearch}
            />
          </Grid>
          <Grid size={4}>
            <DesktopDatePickers
              labelName={"วันที่ออกเอกสาร (Document Issuance Date"}
              value={startDateSearch}
              handleChange={setStartDateSearch}
            />
          </Grid>
          <Grid size={4}>
            <DesktopDatePickers
              labelName={"วันที่พบปัญหา (Date of Detection"}
              value={endDateSearch}
              handleChange={setEndDateSearch}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="flex-end" gap={1}>
          <Grid>
            <FullWidthButton
              labelName={"ค้นหา"}
              handleonClick={Complaint_Get}
              variant_text="contained"
              colorname={"primary"}
            />
          </Grid>
          <Grid>
            <FullWidthButton
              labelName={"รีเซท"}
              handleonClick={handleCloseSearch}
              variant_text="outlined"
              colorname={"inherit"}
            />
          </Grid>
        </Grid>
      </Box>

      <DataTable
        colum={Complaint_headCells}
        rows={datalist}
        titlename={"ข้อมูล Complaint"}
        buttonElement={
          <div className="flex gap-x-4">
            <Button
              variant="contained"
              disabled={menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true}
              color="success"
              onClick={handleOnclickMenuAdd}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "เพิ่มข้อมูล" : ""}
              <AddIcon sx={{}} />
            </Button>

            {/* <Button
              variant="outlined"
              disabled={
                menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true
              }
              color="secondary"
              onClick={handleOnclickMenuUpload}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "อัพโหลด " : ""}
              <UploadFileIcon sx={{}} /> */}
            {/* </Button> */}
          </div>
        }
      />
      {/* <DataTableCollapsible
        colum={Complaint_headCells}
        rows={datalist}
        titlename={"ข้อมูล"}
        buttonElement={
          <div className="flex gap-x-4">
            <Button
              variant="contained"
              disabled={menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true}
              color="success"
              onClick={handleOnclickMenuAdd}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "เพิ่มข้อมูล" : ""}
              <AddIcon sx={{}} />
            </Button>

            <Button
              variant="outlined"
              disabled={
                menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true
              }
              color="secondary"
              onClick={handleOnclickMenuUpload}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "อัพโหลด " : ""}
              <UploadFileIcon sx={{}} />
            </Button>
          </div>
        }
      /> */}
      <FuncDialog
        open={openAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'Save and Submit'}
        handleClose={handleClose}
        handlefunction={Report_Add}
        colorBotton="success"
        element={
          <ComplaintInsert
            action="add"
            onBlocksChange={(data) => setComplaintBlocks(data)}
            // validateText={validateText}
            validateDetailText={blockValidateErrors}
          />}
      />
      {/* <FuncDialog
        open={openView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={'ดูข้อมูล'}
        handleClose={handleClose}
        handlefunction={Report_Add}
        colorBotton="success"
        element={
          <CompalintView
            action="Read"
            // onBlocksChange={(data) => setComplaintBlocks(data)}
            // validateText={validateText}
            // validateDetailText={blockValidateErrors}
          />}
      /> */}
      <FuncDialog
        open={openView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={'ดูข้อมูล'}
        handleClose={handleClose}
        handlefunction={Report_Add}
        colorBotton="success"
        element={<CompalintView
          action="Read"
          dataelement={dataelement}
        />}
      />
    </>
  );
}
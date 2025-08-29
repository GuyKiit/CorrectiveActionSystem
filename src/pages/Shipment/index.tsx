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
import { Box, Button, Divider, Paper, styled,Typography } from "@mui/material";
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
import { useListComplaint } from "./core/ListComlaintContext";
import { Complaint_headCells } from "../../../libs/columnname";
import DataTable from "../../components/MUI/DataTable";
import ComplaintInsert from "./components/ComplaintInsert";
import { log } from "node:console";
import { v4 as uuidv4 } from "uuid";
import { cleanAccessData } from "../../service/initmain/initmain";


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

interface Complaint{
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
    dataReportType_Combobox,
    dataReportTypeValue_Combobox,
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
    setdataReportTypeValue_Combobox,
    setdataComplaintType_Combobox,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRs_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,
    setdataReportType_Combobox,
    setdatapriorityValue_Combobox,
    setdatapriority_Combobox,
    setdatapriority,
    setPriorityLevel,
    setclauseOther,
    setphoTypeOther,
    


  } = useListComplaint()
  const { menuFuncData, userData } = useAuth()
  const { Customer, ProductGroup, CustomerAddress } = useData()
  const { setIsLoadingScreen } = useLayout()
  const [selectDataTable, setSelectDataTable] = React.useState<any>([])
  const [datalist, setdatalist] = React.useState<any>([]);
  // const [viweData, setViewData] = useState<Complaint | null>(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [statusMode, setstatusMode] = React.useState([]);
  const [openSync, setOpenSync] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpLoad, setOpenUpload] = React.useState(false);
  const [dataelement, setdataelement] = React.useState<Launch | null>(null);
  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);

  const [validateText, setValidateText] = React.useState({
    Product_Group: false,
    //Product: false

  });

  const [validateBatchText, setValidateBatchText] = React.useState({
    startDate: false,
    endDate: false,
  });

  const [validateTextLable, setValidateTextLable] = React.useState("");

  //------------------Start Search Index ------------------//
  const [TextNameSearch, setTextNameSearch] = React.useState(
    {
      cas_number: "",
      doc_date: "",
      product_name: "",
      lot_no: "",
    }
  );

  const [startDateSearch, setStartDateSearch] = React.useState<dayjs.Dayjs | undefined | null>(dayjs().subtract(1, 'month'));
  const [endDateSearch, setEndDateSearch] = React.useState<dayjs.Dayjs | undefined | null>(dayjs().add(3, 'month'));
  const [blockValidateErrors, setBlockValidateErrors] = useState<{ [index: number]: data_detail }>({});

  //------------Start Get service refresh -------------//
  React.useEffect(() => {


    
    
    Complaint_Get();
    ReportType_Get();
    ComplaintType_Get();
    ComplaintRs_Get();
    photo_Get();
    priority_Get();
    //Company_Get();
    //Pack_unit_Get();

  }, []);
  const ReportType_Get = async () => {
    try {
      const dataset = {
        lov_type: "report_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("@@@@ success success success success success success success");

        setdataReportType_Combobox && setdataReportType_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  const ComplaintType_Get = async () => {
    try {
      const dataset = {
        lov_type: "complaint_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("@@@@ success success success success success success success");

        setdataComplaintType_Combobox && setdataComplaintType_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  const ComplaintRs_Get = async () => {
    try {
      const dataset = {
        lov_type: "reference_standard"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("@@@@ success success success success success success success");

        setdataComplaintRs_Combobox && setdataComplaintRs_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }
  const photo_Get = async () => {
    try {
      const dataset = {
        lov_type: "attach_type"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("@@@@ success success success success success success success");

        setdataphoto_Combobox && setdataphoto_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  const priority_Get = async () => {
    try {
      const dataset = {
        lov_type: "priority_level"

      }
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        console.log("@@@@ success success success success success success success");

        setdatapriority_Combobox && setdatapriority_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  }

  const setData = (data : any) => {



    setcompTypeOther('')
    setComplaint_no('')
    setno('')
    setcas_number('')
  }
  // const Pack_unit_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_type: "Pack_unit"

  //     }
  //     const response = await _POST(dataset, "/Lov/LovGet");

  //     if (response && response.status === "success") {

  //       setDataPackUnit_Combobox && setDataPackUnit_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // }

  // const Company_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_type: "Company"

  //     }
  //     const response = await _POST(dataset, "/Lov/LovGet");

  //     if (response && response.status === "success") {

  //       setDataCompany_Combobox && setDataCompany_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // }

  // React.useEffect(() => {
  //   Product_Get();
  // }, [dataGroupProductValue_Combobox]);

  // const Product_Get = async () => {
  //   try {
  //     const dataset = {
  //       prod_group: dataGroupProductValue_Combobox?.id ? dataGroupProductValue_Combobox.id : null

  //     }
  //     const response = await _POST(dataset, "/Product/ProductGet");

  //     if (response && response.status === "success") {
  //       const filtered = response.data.filter(
  //         (item: any) => item.prod_group !== null && item.prod_group !== ""
  //       );
  //       setDataProductValue_Combobox && setDataProductValue_Combobox(null);
  //       setDataProduct_Combobox && setDataProduct_Combobox(filtered);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // }

  //----------------Call : Complaint_Get -----------------//
  // const Complaint_Get = async () => {
  //   setIsLoadingScreen(true)
  //   const dataset = {
  //     id : no,
  //     cas_number: TextNameSearch.cas_number,
  //     //Complaint_no: Complaint_no ? Complaint_no : null,
  //     // truck_plate_main: truck_plate_main ? truck_plate_main : null,
  //     // truck_plate_sub: truck_plate_sub ? truck_plate_sub : null,
  //     // prod_group_id: dataGroupProductValue_Combobox?.id ? dataGroupProductValue_Combobox.id : null,
  //     //product_id: dataProductValue_Combobox?.id ? dataProductValue_Combobox.id : null,

  //   }


  //   try {
  //     let response = await _POST(dataset, "/Complaint/ComplaintGet");
  //     console.log(response, "response_Get");
  //     if (response && response.status == "success") {
  //       setIsLoadingScreen(false)
  //       const responseData: any = [];
  //       Array.isArray(response.data) &&
  //         response.data.forEach((el: any) => {
  //           const ACTION = (
  //             <ActionManageCell hadleOnclickMenu={(name: any) => {
  //               if (name == "View") {
  //                 hadleOnclickMenuView(el);
  //               }
  //               if (name == "Edit") {
  //                 hadleOnclickMenuEdit(el);
  //               }
  //               if (name == "Delete") {
  //                 hadleOnclickMenuDelete(el);
  //               }
  //               // if (name == "Print") {
  //               //   hadleOnclickMenuPrint(el);
  //               // }
  //             }}
  //               hiddenEdit={!statusMode.some((mode: any) =>
  //                 mode.lov_code === el.launch_status && mode.lov5.split(",").includes("Edit")
  //               )}
  //               hiddenDelete={!statusMode.some((mode: any) =>
  //                 mode.lov_code === el.launch_status && mode.lov5.split(",").includes("Delete"))}
  //             />
  //           );
  //           el.truck_plate_all = el.truck_plate_main + (el.truck_plate_sub != null ? " / " + el.truck_plate_sub : "")
  //           el.final_mois_result = el.final_mois ? el.final_mois : "-"
  //           el.net_wt_result = el.net_wt ? el.net_wt : "-"
  //           el.Complaint_status_id = (
  //             <BasicChips label={`${el.Complaint_status_id}`}></BasicChips>
  //           );
  //           el.data_detail.forEach((element: any) => {
  //             const ACTION_DETAIL = (
  //               <ActionManageCell hadleOnclickMenu={(name: any) => {
  //                 if (name == "View") {
  //                   hadleOnclickMenuView(el);
  //                 }
  //                 if (name == "Edit") {
  //                   hadleOnclickMenuEdit(el);
  //                 }
  //                 if (name == "Delete") {
  //                   hadleOnclickMenuDelete(el);
  //                 }
  //                 // if (name == "Print") {
  //                 //   hadleOnclickMenuPrint(el);
  //                 // }
  //               }}
  //                 hiddenEdit={!statusMode.some((mode: any) =>
  //                   mode.lov_code === el.launch_status && mode.lov5.split(",").includes("Edit")
  //                 )}
  //                 hiddenDelete={!statusMode.some((mode: any) =>
  //                   mode.lov_code === el.launch_status && mode.lov5.split(",").includes("Delete"))}
  //               />
  //             );
  //             element.ACTION_DETAIL = ACTION_DETAIL;
  //           });

  //           el.ACTION = ACTION;

  //           responseData.push(el);
  //         });

  //       setdatalist(responseData);
  //     }
  //   } catch (e) {
  //     console.log("error");
  //   }
  // };


  const Complaint_Get = async () => {
  setIsLoadingScreen(true);

  const dataset = {
    id: no,
    cas_number: TextNameSearch.cas_number,
  };

  try {
    let response = await _POST(dataset, "/Complaint/ComplaintGet");
    console.log(response, "response_Get");

    if (response && response.status === "success") {
      setIsLoadingScreen(false);

      const responseData: any[] = [];

      if (Array.isArray(response.data)) {
        response.data.forEach((el: any) => {
          // action menu
          const ACTION = (
            <ActionManageCell
              hadleOnclickMenu={(name: any) => {
                if (name === "View") hadleOnclickMenuView(el);
                if (name === "Edit") hadleOnclickMenuEdit(el);
                if (name === "Delete") hadleOnclickMenuDelete(el);
              }}
              hiddenEdit={
                !statusMode.some(
                  (mode: any) =>
                    mode.lov_code === el.launch_status &&
                    mode.lov5.split(",").includes("Edit")
                )
              }
              hiddenDelete={
                !statusMode.some(
                  (mode: any) =>
                    mode.lov_code === el.launch_status &&
                    mode.lov5.split(",").includes("Delete")
                )
              }
            />
          );

          // เพิ่ม field display
          el.truck_plate_all =
            el.truck_plate_main +
            (el.truck_plate_sub != null ? " / " + el.truck_plate_sub : "");
          el.final_mois_result = el.final_mois || "-";
          el.net_wt_result = el.net_wt || "-";
          el.Complaint_status_id = (
            <BasicChips label={`${el.Complaint_status_id}`} />
          );

          // safe check data_detail
          if (Array.isArray(el.data_detail)) {
            el.data_detail.forEach((element: any) => {
              const ACTION_DETAIL = (
                <ActionManageCell
                  hadleOnclickMenu={(name: any) => {
                    if (name === "View") hadleOnclickMenuView(el);
                    if (name === "Edit") hadleOnclickMenuEdit(el);
                    if (name === "Delete") hadleOnclickMenuDelete(el);
                  }}
                  hiddenEdit={
                    !statusMode.some(
                      (mode: any) =>
                        mode.lov_code === el.launch_status &&
                        mode.lov5.split(",").includes("Edit")
                    )
                  }
                  hiddenDelete={
                    !statusMode.some(
                      (mode: any) =>
                        mode.lov_code === el.launch_status &&
                        mode.lov5.split(",").includes("Delete")
                    )
                  }
                />
              );
              element.ACTION_DETAIL = ACTION_DETAIL;
            });
          }

          el.ACTION = ACTION;
          responseData.push(el);
        });
      }

      console.log("responseData after mapping:", responseData);
      setdatalist(responseData);
    }
  } catch (e) {
    console.error("error", e);
    setIsLoadingScreen(false);
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

  function mapComplaintDetail(
    blocks: Block[],
  ): data_detail[] {
    const details = blocks.map(block => ({
      tms_Complaint_no: block.tms_Complaint_no || null,
      prod_id: block.prod_id?.id || null,
      order_po: block.order_po || null,
      order_do: block.order_do || null,
      cus_id: block.customer.id || null,
      cus_name: block.customer.name_th || null,
      cus_address_id: block.address.id || null,
      cus_address: block.address.address_th || null,
      total_weight_ton: block.total_weight_ton || null,
      pack_unit_id: block.pack_unit?.id || null,
      pack_unit_name: block.pack_unit?.lov1 || null,
      qty: block.qty || null,
      note: block.note || null,
      req_coa: block.req[0] ? "1" : "0",
      req_example: block.req[1] ? "1" : "0",
    }));

    return details;
  }
  
  


//----------------Call : validate -----------------//
// const validate = async () => {
//   const setObj = {
//     Product_Group: !dataGroupProductValue_Combobox,
//   }
//   setValidateText(setObj)
//   return setObj
// }

// const validate_detail = (blocks: Block[]) => {
//   const validationResults: { [index: number]: data_detail } = {};

//   blocks.forEach((block, index) => {
//     validationResults[index] = {
//       qty: !block.qty,
//     };
//   });

//   setBlockValidateErrors(validationResults);

//   const isValid = Object.values(validationResults).every(block =>
//     Object.values(block).every(v => v === true)
//   );

//   return { isValid, validationResults };
// };


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

function compRsUpdateCompId(dataComplaintRsValue_Combobox: any, complaintid: string, compRsOther: string, clauseOther: string ) {
  
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
    complaintFileModel = compFileUpdateCompId(dataphotoValue_Combobox, tempid, phoTypeOther, );
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
      action_type: null
    },
    ComplaintType: complainttypeModel,
    ComplaintRs: complaintRsModel,
    ComplaintFile: complaintFileModel
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

//----------------Call : Complaint_Print -----------------//
// const Complaint_Print = async (data: any) => {
//   const dataset = {

//     "no": data?.no ? data.no : null,
//     "LogoUrl": import.meta.env.VITE_APP_TRR_URL_LOGO

//   }

//   try {
//     let response = await await _POST(dataset, "/Print/SendPrint");
//     console.log(response, "response_Get");
//     if (response && response.status == "success") {
//       setIsLoadingScreen(false)

//     }

//   } catch (e) {
//     console.log("error");
//   }
// };


const hadleOnclickMenuSync = () => {
  setOpenSync(true);
};
const hadleOnclickMenuAdd = () => {
  setOpenAdd(true);
};
const hadleOnclickMenuView = (data: any) => {
  setOpenView(true);
  setdataelement(data);
};
const hadleOnclickMenuEdit = (data: any) => {
  setOpenEdit(true);
  setdataelement(data);
};
const hadleOnclickMenuDelete = (data: any) => {
  setOpenDelete(true);
  setdataelement(data);
};
// const hadleOnclickMenuPrint = (data: any) => {
//   Complaint_Print(data);
// };
const hadleOnclickMenuUpload = () => {
  setOpenUpload(true);
};

const handleTableButtonClick = (func_name: string) => {
  switch (func_name) {
    case 'Add':
      hadleOnclickMenuAdd();
      break;
    case 'Upload':
      hadleOnclickMenuUpload();
      break;
    case 'Print':
      console.log("Print clicked");
      break;
    default:
      console.warn("No handler for", func_name);
  }
};


const handleCloseSearch = () => {
  setdataReportTypeValue_Combobox("");
  setdataComplaintTypeValue_Combobox("");
  setdataComplaintRsValue_Combobox("");
  setdataphotoValue_Combobox("");
  setTextNameSearch({
    cas_number: "",
    doc_date: "",
    product_name: "",
    lot_no: "",
  });

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
        {/* <Grid size={4}>
          <AutocompleteComboBox
            value={dataReportTypeValue_Combobox}
            labelName={"Report Type"}
            options={dataReportType_Combobox}
            column="lov_code"
            setvalue={setdataReportTypeValue_Combobox}
          //disabled={false}
          />
        </Grid> */}
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

        {/* <Grid size={3}>
            <AutocompleteComboBox
              value={dataProductValue_Combobox}
              labelName={"สินค้า (Product)"}
              options={dataProduct_Combobox}
              column="name_th"
              setvalue={setDataProductValue_Combobox}
            //disabled={false}
            />
          </Grid> */}
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
            handleonClick={() => { }}
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
      titlename={"ข้อมูล"}
      buttonElement={
        <div className="flex gap-x-4">
          <Button
            variant="contained"
            disabled={menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true}
            color="success"
            onClick={hadleOnclickMenuAdd}
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
              onClick={hadleOnclickMenuUpload}
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
              onClick={hadleOnclickMenuAdd}
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
              onClick={hadleOnclickMenuUpload}
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
          validateText={validateText}
          validateDetailText={blockValidateErrors}

        />}
    />
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
          validateText={validateText}
          validateDetailText={blockValidateErrors}

        />}
    />
    {/* {openView && viweData && (
          <FuncDialog
            open={openView}
            handleClose={handleClose}
            handlefunction={handleClose}
           
            element={
              <div>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    รายละเอียดข้อมูล / ลูกค้า
                  </Typography>

                  <FullWidthTextField
                    labelName="ID"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2, backgroundColor: "#e5e5e5" }}
                    value={viweData.id}
                    disabled
                  />
                
                </Box>
              </div>
            }
          />
        )} */}
    {/* <FuncDialog
        open={openUpLoad}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'อัพโหลด'}
        handleClose={handleClose}
        handlefunction={Complaint_Upload}
        colorBotton="success"
        element={<ComplaintUpload />}
      /> */}

    {/* <FuncDialog
        open={openView}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'ดูข้อมูล'}
        handleClose={handleClose}
        handlefunction={Complaint_Upload}
        colorBotton="success"
        element={<ComplaintView
          action="view"
          dataelement={dataelement}
        />}
      /> */}


  </>
);
}
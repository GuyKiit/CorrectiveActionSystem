/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { Box, Divider } from '@mui/material';
 
const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));
 
function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}
 
function CollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}
 
function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}
 
export default function ReportTreeView() {
  const [dataOrgReport, setDataOrgReport] = React.useState([])
  const [reportList, setReportList] = React.useState<any>([])
  const [reportListName, setReportListName] = React.useState(['head-0', 'head-1']);
  const [openReport, setOpenReport] = React.useState(false);
  const [dataelement, setdataelement] = React.useState<null>(null);
 
 
 
  const reports = [
    {
      headName: "ประเภทรายงานข้อบกพร่อง",
      sub_report: [
        { id: 1, report_code: "NCR", report_name: "รายงานข้อบกพร่องที่ไม่เป็นไปตามข้อกำหนด" },
        { id: 2, report_code: "CAR", report_name: "รายงานคำร้องขอดำเนินการแก้ไข" },
        { id: 4, report_code: "CPAR", report_name: "รายงานคำร้องขอดำเนินการแก้ไขและป้องกัน" },
        { id: 5, report_code: "OBS", report_name: "รายงานข้อบกพร่องที่สามารถยอมรับได้" },
      ]
    },
    {
      headName: "สรุปรวมประเภทรายงาน",
      sub_report: [
        { id: 6, report_code: "ComplaintSummary", report_name: "รายงานสรุปรายการข้อร้องเรียน" }
      ]
    },
  ];
 
  const hadleOnclickReport = (data: any) => {
    setOpenReport(true);
    setdataelement(data)
    console.log("Selected Report:", data);
  };
 
  React.useEffect(() => {
    setReportList(reports);
  }, []);
 
  return (

    <Box
        sx={{
          p: 2,
          mt: 8,
          mb: 2,
          border: "2px solid #39a2f2",
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <div className="px-2 pt-2 pb-5">
          <label className="sarabun-regular-datatable">รายงาน (Report)</label>
        </div>

        <div>
          <div className="max-lg rounded overflow-hidden bg-white mt-2 mb-5">
            {/* <div className="px-6 pt-4">
              <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular text-black">รายงาน (Report)</label>
            </div> */}
            {/* <Divider className="mb-5" sx={{ my: 1, borderWidth: "1px" }} /> */}
            <div className="row px-10 pt-0 pb-5">
              {reportList.length > 0 && (
                <Box sx={{ minHeight: 250, minWidth: 250 }}>
                  <SimpleTreeView
                    aria-label="customized"
                    defaultExpandedItems={reportListName}
                    slots={{
                      expandIcon: ExpandIcon,
                      collapseIcon: CollapseIcon,
                      // endIcon: EndIcon,
                    }}
                  
                  >
                    {reportList.map((el: any, index: number) => (
                      <CustomTreeItem
                        key={`head-${index}`}
                        itemId={`head-${index}`}
                        label={<span className="bold-label sarabun-regular text-black">{el.headName}<span style={{ color: 'red' }}> (ยังไม่พร้อมใช้งาน)</span></span>}
                      >
                        {el?.sub_report?.map((file: any, index: number) => (
                          <CustomTreeItem
                            key={`report-${file.id}`}
                            itemId={`report-${file.id}`}
                            label={
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                  src="image_report/docs.png"
                                  alt="icon"
                                  style={{ width: '16px', height: '16px', marginRight: '8px' }}
                                />
                                <span className="text-black sarabun-regular">{`[ ${file.report_code} ] ${file.report_name}`}</span>
                              </div>
                            }
                            onClick={() => hadleOnclickReport(file)}
                          />
                        ))}
                      </CustomTreeItem>
                    ))}
                  </SimpleTreeView>
                </Box>
              )}
            </div>
          </div>
        </div>
        {/* ======================================================================== */}
        {/* ======================================================================== */}
        {/* <Divider sx={{ my: 0.1, borderColor: "#39a2f2" }} /> */}
        {/* <Grid container spacing={2} my={3}>
          <Grid size={4}>
            <AutocompleteComboBox
              // value={company?.find(
              //   (item: any) => item.company_id === TextNameSearch.company_search
              // ) || null}
              value={
                company?.find(
                  (item: any) =>
                    String(item.company_id) === String(TextNameSearch.company_search)
                ) ||
                company?.find(
                  (item: any) =>
                    String(item.company_id) === String(user[0]?.itasset_company_id)
                ) ||
                null
              }
              labelName="บริษัท (Company)"
              options={company || []}
              column="company_name"
              setvalue={(val) => {
                handleCompanyChange(val);
                setTextNameSearch({

                  ...TextNameSearch,
                  company_search: val?.company_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!isItAdmin}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              // value={domain?.find(
              //   (item: any) => item.domain_id === TextNameSearch.domain_search
              // ) || null}
              value={
                domain?.find(
                  (item: any) =>
                    item.domain_id === TextNameSearch.domain_search
                ) ||
                domain?.find(
                  (item: any) =>
                    String(item.domain_id) === String(user[0]?.domain_name)
                ) ||
                null
              }
              labelName="โรงงาน (Factory)"
              options={domain || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  domain_search: val?.domain_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!isItAdmin}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={department?.find(
                (item: any) => item.domain_dept_id === TextNameSearch.department_search
              ) || null}
              labelName="แผนก (Department)"
              options={department}
              column="department_name"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  department_search: val?.domain_dept_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!TextNameSearch.domain_search}
            />
          </Grid>


        </Grid> */}

        {/* ======================================================================== */}
        {/* ======================================================================== */}
      </Box>

    //==============================================================================================================
    //==============================================================================================================
    //==============================================================================================================

    // <div>
    //   <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-10 mb-5">
    //     <div className="px-6 pt-4">
    //       <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular text-black">รายงาน (Report)</label>
    //     </div>
    //     <Divider className="mb-5" sx={{ my: 1, borderWidth: "1px" }} />
    //     <div className="row px-10 pt-0 pb-5">
    //       {reportList.length > 0 && (
    //         <Box sx={{ minHeight: 352, minWidth: 250 }}>
    //           <SimpleTreeView
    //             aria-label="customized"
    //             defaultExpandedItems={reportListName}
    //             slots={{
    //               expandIcon: ExpandIcon,
    //               collapseIcon: CollapseIcon,
    //               // endIcon: EndIcon,
    //             }}
 
    //           >
    //             {reportList.map((el: any, index: number) => (
    //               <CustomTreeItem
    //                 key={`head-${index}`}
    //                 itemId={`head-${index}`}
    //                 label={<span className="bold-label sarabun-regular text-black">{el.headName}</span>}
    //               >
    //                 {el?.sub_report?.map((file: any, index: number) => (
    //                   <CustomTreeItem
    //                     key={`report-${file.id}`}
    //                     itemId={`report-${file.id}`}
    //                     label={
    //                       <div style={{ display: 'flex', alignItems: 'center' }}>
    //                         <img
    //                           src="image_report/docs.png"
    //                           alt="icon"
    //                           style={{ width: '16px', height: '16px', marginRight: '8px' }}
    //                         />
    //                         <span className="text-black sarabun-regular">{`[ ${file.report_code} ] ${file.report_name}`}</span>
    //                       </div>
    //                     }
    //                     onClick={() => hadleOnclickReport(file)}
    //                   />
    //                 ))}
    //               </CustomTreeItem>
    //             ))}
    //           </SimpleTreeView>
    //         </Box>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
 
 

import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { Box } from '@mui/material';
import ReportBody from './reportbody';
 
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

 
export default function ReportTreeView() {
  const [reportList, setReportList] = React.useState<any>([])
  const [reportListName, setReportListName] = React.useState(['head-0', 'head-1']);
  const [openReport, setOpenReport] = React.useState(false);
  const [tempReportParam, setTempReportParam] = React.useState<any>(null);
 
 
  const reports = [
    {
      headName: "สรุปรวมประเภทรายงาน",
      sub_report: [
        { id: 1, report_code: "RPT_Complaint_Summary", report_name: "รายงานสรุปรายการข้อร้องเรียน" }
      ]
    },
  ];
 
  const hadleOnclickReport = (data: any) => {
    setTempReportParam(data);
    setOpenReport(true);
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
            <div className="row px-10 pt-0 pb-5">
              {reportList.length > 0 && (
                <Box sx={{ minHeight: 250, minWidth: 250 }}>
                  <SimpleTreeView
                    aria-label="customized"
                    defaultExpandedItems={reportListName}
                    slots={{
                      expandIcon: ExpandIcon,
                      collapseIcon: CollapseIcon,
                    }}
                  >
                    {reportList.map((el: any, index: number) => (
                      <CustomTreeItem
                        key={`head-${index}`}
                        itemId={`head-${index}`}
                        label={<span className="bold-label sarabun-regular text-black">{el.headName}</span>}
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
                  {/* ==================== Report Preview ==================== */}
                  <ReportBody
                    mode="summary_report"
                    open={openReport}
                    tempReportParam={tempReportParam}
                    onClose={() => setOpenReport(false)}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>
      </Box>

    //==============================================================================================================
    //==============================================================================================================
    //==============================================================================================================
  );
}
 
 

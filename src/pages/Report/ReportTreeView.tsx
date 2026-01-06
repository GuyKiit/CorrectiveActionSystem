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
      haedName: "ประเภทรายงานข้อบกพร่อง",
      sub_report: [
        { id: 1, report_code: "NCR", report_name: "รายงานข้อบกพร่องที่ไม่เป็นไปตามข้อกำหนด" },
        { id: 2, report_code: "CAR", report_name: "รายงานคำร้องขอดำเนินการแก้ไข" },
        { id: 4, report_code: "CPAR", report_name: "รายงานคำร้องขอดำเนินการแก้ไขและป้องกัน" },
        { id: 5, report_code: "OBS", report_name: "รายงานข้อบกพร่องที่สามารถยอมรับได้" },
      ]
    },
    {
      haedName: "สรุปรวมประเภทรายงาน",
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

    <div>
      <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-10 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular text-black">รายงาน (Report)</label>
        </div>
        <Divider className="mb-5" sx={{ my: 1, borderWidth: "1px" }} />
        <div className="row px-10 pt-0 pb-5">
          {reportList.length > 0 && (
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
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
                    label={<span className="bold-label sarabun-regular text-black">{el.haedName}</span>}
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
  );
}
 
 

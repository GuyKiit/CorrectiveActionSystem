// import React, { useEffect, useState } from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { useAuth } from "../../auth/core/AuthContext";
// import { useLayout } from "../../layout/core/LayoutProvider";
// import { useData } from "../../auth/core/DataContext";
// import { cleanAccessData } from "../../service/initmain/initmain";
// import { _POST } from "../../service/mas";
// import { mas_DomainGet, mas_DepartmentDomainGet } from "../../service/mas/lov";
// import dayjs from "dayjs";
// import DesktopDatePickers from "../../components/MUI/DesktopDatePicker";
// import ActionManageCell from "../../components/MUI/ActionManageCell";

// interface Report {
//   id: string;
//   name: string;
//   type: 'Sales' | 'Inventory' | 'Financial' | 'Customer';
//   dateCreated: string;
//   status: 'Completed' | 'Processing' | 'Failed';
//   size: string;
//   createdBy: string;
// }

// export default function ReportListPage() {
//   // Authentication & Layout
//   const user = cleanAccessData("userSession");
//   const { setIsLoadingScreen } = useLayout();
//   const { menuFuncData, userData } = useAuth();

//   // State for Search/Permissions
//   const [reports, setReports] = useState<Report[]>([]); // Keep existing mock for now
//   const [searchTerm, setSearchTerm] = useState(''); // Keep existing

//   // Master Data & Selection State
//   const [dataset_activeCompany, setdataset_activeCompany] = useState<any[]>([]);
//   const [dataset_roleProfile, setdataset_roleProfile] = useState<any[]>([]);
//   const [company, set_company] = useState<any[]>([]);
//   const [domain, set_domain] = useState<any[]>([]);
//   const [department, set_department] = useState<any[]>([]);

//   const [dept_company, setdept_company] = useState<any>(null);
//   const [dept_domain, setdept_domain] = useState<any>(null);
//   const [domain_dept_id, setdomain_dept_id] = useState<any>(null);

//   const [TextNameSearch, setTextNameSearch] = React.useState({
//     company_search: "",
//     domain_search: "",
//     department_search: ""
//   });

//   // Permission Logic
//   const tempRoleUser = dataset_roleProfile?.filter(
//     (item: any) => item.lov1 === String(user[0]?.role_id)
//   );
//   const isItAdmin = tempRoleUser?.[0]?.lov_code === "it_admin";

//   // For Logging
//   const [isCallFuncLogOn] = useState(true);

//   // =====================================================================================================
//   // API FUNCTIONS
//   // =====================================================================================================

//   const LovAll_Get = async () => {
//     if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  LovAll_Get");
//     try {
//       const dataset = {
//         lov_group: user[0]?.itasset_company_id + ",VARIABLE_CONSTANT",
//         lov_type: "active_company,role_profile",
//       };
//       const response = await _POST(dataset, "/Lov/LovGet");
//       if (response && response.status === "success") {
//         const lovData = response.data || [];
//         const grouped = lovData.reduce((acc: any, item: any) => {
//           if (!acc[item.lov_type]) acc[item.lov_type] = [];
//           acc[item.lov_type].push(item);
//           return acc;
//         }, {});

//         setdataset_activeCompany(grouped["active_company"] || []);
//         setdataset_roleProfile(grouped["role_profile"] || []);
//       }
//     } catch (e) {
//       console.error("error:", e);
//     }
//   };

//   const CompanyGet = async () => {
//     if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");
//     try {
//       const response = await _POST({}, "/Complaint/CasCompanyGet");
//       if (response && response.status === "success") {
//         const activeCompany = dataset_activeCompany;
//         if (activeCompany?.length > 0) {
//           const active = activeCompany[0]?.lov1 || "";
//           const activeid = active.split(",").map((id: string) => id.trim());
//           const filteredCompany = response.data.filter((company: any) =>
//             activeid.includes(company.company_id.toString())
//           );
//           set_company(filteredCompany);
//         } else {
//           set_company(response.data);
//         }
//       }
//     } catch (e) {
//       console.error("error:", e);
//     }
//   };

//   const handleCompanyChange = (value: any) => {
//     if (value != null) {
//       setdept_company(value);
//       setTextNameSearch(prev => ({ ...prev, company_search: value.company_id }));
//       mas_DomainGet(value.company_id, set_domain, user, isCallFuncLogOn);
//     } else {
//       setdept_company(null);
//       set_domain([]);
//       set_department([]);
//       setdept_domain(null);
//       setdomain_dept_id(null);
//       setTextNameSearch(prev => ({
//         ...prev,
//         company_search: "",
//         domain_search: "",
//         department_search: ""
//       }));
//     }
//   };

//   const handleDomainChange = (value: any) => {
//     if (value != null) {
//       setdept_domain(value);
//       setTextNameSearch(prev => ({ ...prev, domain_search: value.domain_id }));
//       const dataset = {
//         domain_id: value.domain_id,
//         company_id: dept_company?.company_id || Number(TextNameSearch.company_search),
//       };
//       mas_DepartmentDomainGet(dataset, set_department, isCallFuncLogOn);
//     } else {
//       setdept_domain(null);
//       set_department([]);
//       setdomain_dept_id(null);
//       setTextNameSearch(prev => ({
//         ...prev,
//         domain_search: "",
//         department_search: ""
//       }));
//     }
//   };

//   const handleDepartmentChange = (value: any) => {
//     if (value != null) {
//       setdomain_dept_id(value);
//       setTextNameSearch(prev => ({ ...prev, department_search: value.department_id }));
//     } else {
//       setdomain_dept_id(null);
//       setTextNameSearch(prev => ({ ...prev, department_search: "" }));
//     }
//   }

//   // =====================================================================================================
//   // EFFECTS
//   // =====================================================================================================

//   useEffect(() => {
//     LovAll_Get();
//   }, []);

//   useEffect(() => {
//     if (dataset_activeCompany.length > 0) {
//       CompanyGet();
//     }
//   }, [dataset_activeCompany]);

//   // Initial Data Mapping for Non-Admin
//   useEffect(() => {
//     const initializeUserDefaults = async () => {
//       if (!isItAdmin && company.length > 0) {
//         // Default to user's company
//         const userCompany = company.find((c: any) => c.company_id == user[0]?.itasset_company_id);
//         if (userCompany) {
//           handleCompanyChange(userCompany);

//           // Fetch Domains -> Then default to user's domain
//           mas_DomainGet(userCompany.company_id, (domains: any) => {
//             set_domain(domains);
//             const userDomain = domains.find((d: any) => d.domain_id == user[0]?.employee_domain);
//             if (userDomain) {
//               handleDomainChange(userDomain);

//               // Fetch Departments -> Then default to user's department
//               const dataset = {
//                 domain_id: userDomain.domain_id,
//                 company_id: userCompany.company_id,
//               };
//               mas_DepartmentDomainGet(dataset, (depts: any) => {
//                 set_department(depts);
//                 const userDept = depts.find((d: any) => d.department_id == user[0]?.itasset_department_id); 
                
//                 if (userDept) {
//                   handleDepartmentChange(userDept);
//                 }
//               }, isCallFuncLogOn);
//             }
//           }, user, isCallFuncLogOn);
//         }
//       }
//     };

//     if (company.length > 0 && dataset_roleProfile.length > 0) {
//       initializeUserDefaults();
//     }
//   }, [company, dataset_roleProfile, isItAdmin]);

//   useEffect(() => {
//     // Mock data - replace with actual API call
//     const mockReports: Report[] = [
//       {
//         id: '1',
//         name: 'Complaint Report NCR',
//         type: 'Sales',
//         dateCreated: '2024-01-15',
//         status: 'Completed',
//         size: '2.5 MB',
//         createdBy: 'John Doe'
//       },
//       {
//         id: '2',
//         name: 'Complaint Report CAR',
//         type: 'Inventory',
//         dateCreated: '2024-01-14',
//         status: 'Processing',
//         size: '1.8 MB',
//         createdBy: 'Jane Smith'
//       },
//       {
//         id: '3',
//         name: 'Complaint Report C-PAR',
//         type: 'Financial',
//         dateCreated: '2024-01-13',
//         status: 'Completed',
//         size: '3.2 MB',
//         createdBy: 'Mike Johnson'
//       },
//       {
//         id: '4',
//         name: 'Complaint Report OBS',
//         type: 'Customer',
//         dateCreated: '2024-01-12',
//         status: 'Failed',
//         size: '0 MB',
//         createdBy: 'Sarah Wilson'
//       }
//     ];
//     setReports(mockReports);
//   }, []);


//   const handleSearch = () => {
//     console.log("Search triggered with:", TextNameSearch);
//     // Implement actual search API call here
//   };

//   const handleCloseSearch = () => {
//     setTextNameSearch({
//       company_search: "",
//       domain_search: "",
//       department_search: ""
//     });
//     setdept_company(null);
//     setdept_domain(null);
//     setdomain_dept_id(null);
//     set_domain([]);
//     set_department([]);
//     // Reset other states if needed
//   };

//   // Filter reports based on search (Mock logic for now adapting to new search)
//   const filteredReports = reports.filter(report => {
//     // For now just return all or filter by text if we kept it
//     return true;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Completed': return 'success';
//       case 'Processing': return 'warning';
//       case 'Failed': return 'error';
//       default: return 'default';
//     }
//   };

//   const handleRefresh = () => {
//     // Implement refresh logic
//     console.log('Refreshing reports...');
//   };

//   const handleView = (reportId: string) => {
//     console.log('Viewing report:', reportId);
//   };

//   const handleDownload = (reportId: string) => {
//     console.log('Downloading report:', reportId);
//   };

//   return (
//     <>
//       {/* Search Section */}
//       {/* <Box
//         sx={{
//           p: 2,
//           mt: 8,
//           mb: 2,
//           border: "2px solid #39a2f2",
//           borderRadius: 2,
//           backgroundColor: "#ffffff",
//         }}
//       >
//         <div className="px-2 pt-2 pb-5">
//           <label className="sarabun-regular-datatable">ค้นหา รายงาน</label>
//         </div>
//         <Divider sx={{ my: 0.1, borderColor: "#39a2f2" }} />
//         <Grid container spacing={2} my={3}>
//           <Grid size={4}>
//             <AutocompleteComboBox
//               value={
//                 company?.find(
//                   (item: any) =>
//                     String(item.company_id) === String(TextNameSearch.company_search)
//                 ) ||
//                 company?.find(
//                   (item: any) =>
//                     String(item.company_id) === String(user[0]?.itasset_company_id)
//                 ) ||
//                 null
//               }
//               labelName="บริษัท (Company)"
//               options={company || []}
//               column="company_name"
//               setvalue={(val) => {
//                 handleCompanyChange(val);
//               }}
//               readonly={!isItAdmin}
//             />
//           </Grid>
//           <Grid size={4}>
//             <AutocompleteComboBox
//               value={
//                 domain?.find(
//                   (item: any) =>
//                     item.domain_id === TextNameSearch.domain_search
//                 ) ||
//                 domain?.find(
//                   (item: any) =>
//                     String(item.domain_id) === String(user[0]?.domain_name)
//                 ) ||
//                 null
//               }
//               labelName="โรงงาน (Factory)"
//               options={domain || []}
//               column="domain_name"
//               setvalue={(val) => {
//                 handleDomainChange(val);
//               }}
//               readonly={!isItAdmin}
//             />
//           </Grid>
//           <Grid size={4}>
//             <AutocompleteComboBox
//               value={
//                 department?.find(
//                   (item: any) =>
//                     item.department_id === TextNameSearch.department_search
//                 ) || null
//               }
//               labelName="แผนก (Department)"
//               options={department || []}
//               column="department_name"
//               setvalue={(val) => {
//                 handleDepartmentChange(val);
//               }}
//               readonly={!isItAdmin || !TextNameSearch.domain_search}

//             />
//           </Grid>

//           <Grid size={4}>
//             <AutocompleteComboBox
//               value={
//                 department?.find(
//                   (item: any) =>
//                     item.department_id === TextNameSearch.department_search
//                 ) || null
//               }
//               labelName="ประเภทเอกสาร (Report Type)"
//               // options={department || []}
//               // column="department_name"
//               // setvalue={(val) => {
//               //   handleDepartmentChange(val);
//               // }}
//               readonly={!TextNameSearch.domain_search}
//             />
//           </Grid>
//           <Grid size={4}>
//             <DesktopDatePickers
//               // value={startDate}
//               labelName="วันที่เริ่มต้น (Start Date)"
//             // handleChange={(val) => setStartDate(val || null)}
//             />
//           </Grid>
//           <Grid size={4}>
//             <DesktopDatePickers
//               // value={endDate}
//               labelName="วันที่สิ้นสุด (End Date)"
//             // handleChange={(val) => setEndDate(val || null)}
//             />
//           </Grid>


//         </Grid>



//         <Grid
//           container
//           spacing={2}
//           sx={{ mt: 2 }}
//           justifyContent="flex-end"
//           gap={1}
//         >
//           <Grid>
//             <FullWidthButton
//               labelName={"ค้นหา"}
//               handleonClick={handleSearch}
//               variant_text="contained"
//               colorname={"primary"}
//             />
//           </Grid>
//           <Grid>
//             <FullWidthButton
//               labelName={"รีเซ็ต"}
//               handleonClick={handleCloseSearch}
//               variant_text="outlined"
//               colorname={"inherit"}
//             />
//           </Grid>
//         </Grid>
//       </Box> */}

//       {/* Reports Table Section */}
//       <Box sx={{
//         p: 2,
//         mt: 8,
//         border: "2px solid #39a2f2",
//         borderRadius: 2,
//         backgroundColor: "#ffffff",
//       }}>

//         <TableContainer component={Paper}>
//           <Table size="medium">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                 <TableCell><strong>จัดการ</strong></TableCell>
//                 <TableCell align="justify"><strong>ชื่อรายงาน</strong></TableCell>
//                 {/* <TableCell><strong>ประเภท</strong></TableCell> */}
//                 {/* <TableCell><strong>วันที่สร้าง</strong></TableCell> */}
//                 {/* <TableCell><strong>Status</strong></TableCell> */}
//                 {/* <TableCell><strong>ขนาด</strong></TableCell>
//                 <TableCell><strong>สร้างโดย</strong></TableCell> */}
                
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredReports.map((report) => (
//                 <TableRow key={report.id} hover>
                  
//                   <TableCell>
//                     <ActionManageCell
//                     hiddenDepartmentAdd={true}
//                     hiddenDepartmentView={true}
//                     hiddenDepartmentEdit={true}
//                     hiddenDepartmentDelete={true}
//                     hiddenRead={true}
//                     hiddenReadExplain={true}
//                     hiddenReadApproveSC={true}
//                     hiddenReadApproveQC={true}
//                     hiddenReadClose={true}
//                     hiddenCloseHistory={true}
//                     />
//                   </TableCell>
//                   <TableCell align="justify">{report.name}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {filteredReports.length === 0 && (
//           <Box sx={{ textAlign: 'center', py: 4 }}>
//             <Typography variant="h6" color="text.secondary">
//               No reports found
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Try adjusting your search or filter criteria
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }




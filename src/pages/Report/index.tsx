import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Stack,
  Grid,
  Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";

interface Report {
  id: string;
  name: string;
  type: 'Sales' | 'Inventory' | 'Financial' | 'Customer';
  dateCreated: string;
  status: 'Completed' | 'Processing' | 'Failed';
  size: string;
  createdBy: string;
}

export default function ReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Complaint Report',
        type: 'Sales',
        dateCreated: '2024-01-15',
        status: 'Completed',
        size: '2.5 MB',
        createdBy: 'John Doe'
      },
      {
        id: '2',
        name: 'Inventory Analysis Q1',
        type: 'Inventory',
        dateCreated: '2024-01-14',
        status: 'Processing',
        size: '1.8 MB',
        createdBy: 'Jane Smith'
      },
      {
        id: '3',
        name: 'Financial Summary 2024',
        type: 'Financial',
        dateCreated: '2024-01-13',
        status: 'Completed',
        size: '3.2 MB',
        createdBy: 'Mike Johnson'
      },
      {
        id: '4',
        name: 'Customer Analytics',
        type: 'Customer',
        dateCreated: '2024-01-12',
        status: 'Failed',
        size: '0 MB',
        createdBy: 'Sarah Wilson'
      },
      {
        id: '5',
        name: 'Weekly Sales Trends',
        type: 'Sales',
        dateCreated: '2024-01-11',
        status: 'Completed',
        size: '1.1 MB',
        createdBy: 'David Brown'
      }
    ];
    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || report.type === filterType;
    const matchesStatus = filterStatus === 'All' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const handleRefresh = () => {
    // Implement refresh logic
    console.log('Refreshing reports...');
  };

  const handleView = (reportId: string) => {
    console.log('Viewing report:', reportId);
  };

  const handleDownload = (reportId: string) => {
    console.log('Downloading report:', reportId);
  };

  return (
    // <Box
    //         sx={{
    //           p: 2,
    //           mt: 8,
    //           mb: 2,
    //           border: "2px solid #39a2f2",
    //           borderRadius: 2,
    //           backgroundColor: "#ffffff",
    //         }}
    //       >

    <Box sx={{
       mt: 8,
       pt: 3,
       pb: 3,
       pl: 3,
       pr: 3,
       border: "2px solid #39a2f2",
       borderRadius: 2,
       backgroundColor: "#ffffff",
       }}>
       <div className="px-2">
         <label className="sarabun-regular-datatable">Reports Dashboard</label>
       </div>
       {/* <Typography variant="h6" component="h1" gutterBottom>
        Reports Dashboard
      </Typography> */}
      <Divider sx={{ my: 3, borderColor: "#39a2f2" }} /> 
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Reports Dashboard
      </Typography> */}
      
      {/* <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Inventory">Inventory</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
              >
                Generate New Report
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell><strong>ชื่อรายงาน</strong></TableCell>
              {/* <TableCell><strong>ประเภท</strong></TableCell> */}
              <TableCell><strong>วันที่สร้าง</strong></TableCell>
              {/* <TableCell><strong>Status</strong></TableCell> */}
              <TableCell><strong>ขนาด</strong></TableCell>
              <TableCell><strong>สร้างโดย</strong></TableCell>
              <TableCell align="center"><strong>จัดการ</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>{report.name}</TableCell>
                {/* <TableCell>
                  <Chip 
                    label={report.type} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell> */}
                <TableCell>{report.dateCreated}</TableCell>
                {/* <TableCell>
                  <Chip 
                    label={report.status} 
                    size="small"
                    color={getStatusColor(report.status) as any}
                  />
                </TableCell> */}
                <TableCell>{report.size}</TableCell>
                <TableCell>{report.createdBy}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleView(report.id)}
                      title="View Report"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDownload(report.id)}
                      disabled={report.status !== 'Completed'}
                      title="Download Report"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredReports.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No reports found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
}




import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, Divider, FormControl, Grid, InputAdornment, MenuItem, Pagination, Select, SelectChangeEvent, TableSortLabel, TextField, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";


interface CustomTable {
  colum: any;
  rows?: any;
  titlename?: string;
  noDataname?: string;
  select?: boolean;
  buttonElement?: React.ReactElement;
  dataSelect?: any;
  setDataSelect?: (data: any) => void
}

type Order = "asc" | "desc";

export default function DataTable({ colum, rows, titlename, noDataname = "ไม่พบรายการ", select, buttonElement, dataSelect, setDataSelect }: CustomTable) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("calories");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");

  // console.log('[DataTable] colum : ', colum);


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    console.log(property, "property");

    setOrderBy(String(property));
  };

  const filteredData = rows.filter((item: any) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredData]
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Function Select All
  const handleSelectAll = (e: any) => {
    if (!setDataSelect) return;
    // Multi-selection mode
    if (e.target.checked) {
      const newSelected = rows;
      setDataSelect(newSelected);
    } else {
      setDataSelect([]);
    }
  };

  // Function Select Item
  const handleClick = (selectedItem: any) => {
    if (!setDataSelect) return;

    // Helper function to get item ID
    const getItemId = (item: any) => {
      return item.id || item.acct_id || item.repayment_id || item.un_apply_id;
    };
    // Multi-selection mode
    const currentSelected = [...dataSelect]; // Create new array to avoid mutation
    const selectedId = getItemId(selectedItem);

    if (selectedId) {
      // Use ID-based comparison for better performance
      const existingIndex = currentSelected.findIndex(item =>
        getItemId(item) === selectedId
      );

      if (existingIndex !== -1) {
        // Item is already selected, remove it
        currentSelected.splice(existingIndex, 1);
      } else {
        // Item is not selected, add it
        currentSelected.push(selectedItem);
      }
    } else {
      // Fallback to deep comparison if no ID available
      const existingIndex = currentSelected.findIndex(item =>
        JSON.stringify(item) === JSON.stringify(selectedItem)
      );

      if (existingIndex !== -1) {
        currentSelected.splice(existingIndex, 1);
      } else {
        currentSelected.push(selectedItem);
      }
    }
    setDataSelect(currentSelected);

  };

  // Function Check Selected
  const _isSelected = (item: any) => {
    // Helper function to get item ID (same as in handleClick)
    const getItemId = (obj: any) => {
      return obj.id || obj.acct_id || obj.repayment_id || obj.un_apply_id;
    };

    // Multi-selection mode - check if item exists in the array
    const itemId = getItemId(item);

    if (itemId) {
      return dataSelect?.some((selectedItem: any) =>
        getItemId(selectedItem) === itemId
      );
    } else {
      return dataSelect?.some((selectedItem: any) =>
        JSON.stringify(selectedItem) === JSON.stringify(item)
      );
    }
  };


  // Clear selected data when rows change
  React.useEffect(() => {
    setPage(1);
    setDataSelect && setDataSelect([])
  }, [rows]);

  return (
    <div className="block w-full p-6  border-gray-200 rounded-lg shadow-sm" style={{ border: "2px solid #39a2f2" }}>
      {/* <div className="text-2xl text-center flex-grow">
        {titlename}
      </div> */}
      <div className="px-2 pt-2 pb-5">
        <label className="sarabun-regular-datatable">
          {titlename}
        </label>
      </div>
      <Divider className="mb-5" sx={{ my: 0.1, borderColor: "#39a2f2" }} />
      <div className="flex px-5 pt-5 items-center justify-between w-full">
        <div className="flex items-center">
          {buttonElement}
        </div>
        <div className="flex items-center justify-end">
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      {/* <div>
        {buttonElement}
      </div> */}
      <div className="p-5">
        <TableContainer className="border border-gray-300 rounded-lg">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {select && (
                  <TableCell
                    //align={"center"}
                    //padding={"none"}
                    sortDirection={orderBy === "id" ? order : false}
                    //sx={{ minWidth: 50 }}
                    className="border border-gray-500/10 bg-gray-50"
                  >
                    <Checkbox
                      color="primary"
                      indeterminate={
                        dataSelect?.length > 0 && dataSelect?.length < filteredData?.length
                      }
                      checked={
                        filteredData?.length > 0 && dataSelect?.length === filteredData?.length
                      }
                      onClick={(e: any) => handleSelectAll(e)}
                      inputProps={{
                        "aria-label": "select all",
                      }}
                    />
                  </TableCell>
                )}
                {colum.map((headCell: any, index: number) => (

                  <TableCell
                    key={index}
                    align={headCell.numeric}
                    //sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ minWidth: headCell?.colWidth }}
                    className="border border-gray-500/10 bg-gray-50"
                  >
                    <TableSortLabel
                      active={orderBy === headCell.columnName}
                      direction={orderBy === headCell.columnName ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, headCell.columnName)}
                      sx={{}}
                    >
                      <label className="text-gray-600 pl-5 text-center sarabun-regular">
                        {headCell.label}
                      </label>
                      {orderBy === headCell.columnName ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>





            <TableBody>
              {visibleRows &&
                visibleRows.map((row: any, index: number) => {

                  return (
                    <TableRow
                      className={`hover:bg-blue-50`}
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {/* Render checkbox cell only once if selectAll is enabled */}
                      {select && (
                        <TableCell
                          align="center"
                          padding="none"
                          className="border border-gray-500/10"
                        >
                          <Checkbox
                            color="primary"
                            checked={_isSelected(row)}
                            onClick={() => handleClick(row)}
                            inputProps={{
                              "aria-label": "select row",
                            }}
                          />
                        </TableCell>
                      )}

                      {/* Render data cells for each column */}
                      {colum?.map((column: any, cellIndex: number) => {
                        const value = row[column.columnName];

                        return (
                          <TableCell
                            key={`${column.columnName}-${cellIndex}`}
                            align={column.numeric || "center"}
                            className="border border-gray-500/10"
                          >
                            {/* ✅ 1. ถ้าเป็น React Element */}
                            {React.isValidElement(value) ? (
                              value
                            ) :
                              /* ✅ 2. ถ้าเป็น string HTML (มี <br/>) */
                              typeof value === "string" && value.includes("<br") ? (
                                <div
                                  className="text-gray-600"
                                  dangerouslySetInnerHTML={{ __html: value }}
                                ></div>
                              ) : (
                                /* ✅ 3. ค่าธรรมดา */
                                <div className="text-gray-600">{value ?? ""}</div>
                              )}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  );
                })}
              {Array.isArray(rows) && rows.length == 0 && (
                <TableRow>
                  <TableCell
                    colSpan={colum.length}
                    sx={{ width: "100%" }}
                    align={colum.numeric}
                  >
                    <label className="text-gray-500">{noDataname}</label>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>





          </Table>
        </TableContainer>
        <div>
          <Grid pt={3}>
            <Grid
              container
              justifyContent={"flex-end"}
              alignItems={"center"}
              spacing={2}
              px={2}
            >
              <Grid >
                <FormControl size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    // id="demo-simple-select"
                    value={String(rowsPerPage)}
                    // label="Age"
                    onChange={handleChangeRowsPerPage}
                    size="small"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid >
                <Pagination
                  variant="outlined"
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  count={
                    isNaN(Math.ceil(filteredData?.length / rowsPerPage))
                      ? 0
                      : Math.ceil(filteredData?.length / rowsPerPage)
                  }
                />
              </Grid>
              <Grid >
                <Typography fontSize={14}>
                  {filteredData?.length > 0 &&
                    "จำนวนรายการทั้งหมด " + filteredData?.length + " รายการ"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}


function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
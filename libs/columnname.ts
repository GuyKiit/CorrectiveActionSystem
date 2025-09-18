import dayjs from "dayjs";

export interface LovType {
    id: string;
    lov_id: string;
    lov_group: string;
    lov_type: string;
    lov_code: string;
    lov1: string;
}

export const Complaint_headCells = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        //disablePadding: true,
        label: 'จัดการ',
        //colWidth: 100
    },
    {
        columnName: 'report_code',
        numeric: 'center',
        disablePadding: true,
        label: 'ประเภทเอกสาร',
        colWidth: 150,
    },
    {
        columnName: 'cas_number',
        numeric: 'center',
        disablePadding: true,
        label: 'CAS Number',
        colWidth: 150
    },
    {
        columnName: 'product_name',
        numeric: 'center',
        disablePadding: true,
        label: 'ชื่อผลิตภัณฑ์',
        colWidth: 150
    },
    {
        columnName: 'lot_no',
        numeric: 'center',
        disablePadding: true,
        label: 'Lot No. / Bag No.',
        colWidth: 150
    },
    {
        columnName: 'doc_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่ออกเอกสาร',
        colWidth: 200,
    },
    {
        columnName: 'respond_date_within',
        numeric: 'center',
        disablePadding: true,
        label: 'ตอบกลับภายในวันที่',
        colWidth: 200,
    },
    
    {
        columnName: 'record_status',
        numeric: 'center',
        disablePadding: false,
        label: 'สถานะ',
        colWidth: 150,
        render: (row: any, lovList: LovType[]) => {
            // หา lov_code จาก lovList
            const lov = lovList.find((l: LovType) => l.id === row.complaint_status);
            return lov ? lov.lov_code : row.complaint_status;
        }

    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: false,
        label: 'แก้ไขโดย',
        colWidth: 150
    },
    {
        columnName: 'update_datetime',
        numeric: 'center',
        disablePadding: false,
        label: 'วันที่แก้ไข',
        colWidth: 200
    },

]

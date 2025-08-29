import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, DialogContent, TextField } from '@mui/material';

interface FuncDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  showSubmitButton?: boolean;
  submitLabel?: string;
}

function FuncDialog1(props: FuncDialogProps) {
  const { open, onClose, onSubmit, title, showSubmitButton = false, submitLabel = 'ตกลง' } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Box sx={{ px: 3, py: 1 }}>
          {/* คุณสามารถใส่ element ตรงนี้ เช่น form หรือ component */}
          <Typography variant="body1" color="text.secondary">
            ตรงนี้เป็นเนื้อหา Dialog ที่คุณต้องการแสดง
          </Typography>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>
          <TextField>5555555555555555555555</TextField>

        </Box>
      </DialogContent>


      <DialogActions sx={{ px: 3, pb: 2 }}>
        {showSubmitButton && (
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {submitLabel}
          </Button>
        )}
        <Button variant="contained" color="secondary" onClick={onClose}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FuncDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    console.log('กดตกลง');
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        เปิด Dialog
      </Button>
      <FuncDialog1
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="ตัวอย่าง Dialog"
        showSubmitButton
        submitLabel="ยืนยัน"
      />

      {/* <FuncDialog
        open={open}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'เพิ่มข้อมูล'}
        handleClose={handleClose}
        handlefunction={() => { }}
        colorBotton="successTheme"
        element={<OrderInsert action="add"></OrderInsert>
        }
      >
      </FuncDialog> */}

      <Button
        onClick={handleOpen}>55555</Button>
      <BasicTable></BasicTable>

    </div>
  );
}


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

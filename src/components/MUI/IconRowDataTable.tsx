import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
import { green, pink, yellow } from '@mui/material/colors';
interface IconRowDataTable {
  date: any
}





export default function IconRowDataTable({ date }: IconRowDataTable) {

  return (
    <>
      {date.active_flag && date.active_flag == '1' ? (
        <CheckCircleTwoToneIcon
          sx={{ fontSize: 30, color: green[500] }}
        />
      ) :date.active_flag && date.active_flag != '1' ? (
        <HighlightOffTwoToneIcon
          sx={{ fontSize: 30, color: pink[500] }}
        />
      ) :date.launch_status && date.launch_status == 'SUBMIT' ? (
        <AlarmTwoToneIcon
          sx={{ fontSize: 30, color: yellow[700] }}
        />
      ) :date.launch_status && date.launch_status == 'APPROVE' ? (
        <CheckCircleTwoToneIcon
          sx={{ fontSize: 30, color: green[500] }}
        />
      ) : null}
    </>
  );
}

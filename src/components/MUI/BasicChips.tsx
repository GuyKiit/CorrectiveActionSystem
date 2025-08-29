import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface BasicChips {
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const allColorMap: Record<string, string> = {
  PO: "#c7e8ff",
  QUEUE: "#FFE8A3",
  WIN: "#FCA437",
  DUMP: "#FE97B0",
  WOT: "#96F8E0",
  TEST: "#E4CCFF",
  SUBMIT: "#FFC7C2",
  APPROVE: "#AFF4C6",
  CANCEL: "#B3B3B3",
};

const defaultColor = "#B3B3B3";

export default function BasicChips(props: BasicChips) {
  const getStatusColor = () => {
    if (!props.label) return defaultColor;
    return allColorMap[props.label];
  };
  const statusColor = getStatusColor();

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" >
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={props.label}
            variant="outlined"
            sx={{
              backgroundColor: props.backgroundColor || statusColor,
              color: "#000000",
              borderColor: props.borderColor || statusColor,
            }}
          />
        </Stack>
      </Box>

    </>
  );
}

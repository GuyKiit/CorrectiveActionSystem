import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface BasicChips {
  label?: string;
  acknowledge?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  type?: "status" | "step";
}

const defaultColor = "#B3B3B3";
const unread = "#FE97B0";

export default function BasicChips(props: BasicChips) {

  const allColorMap: Record<string, string> = {
    NEW: "#4A90E2",
    SUBMIT: props.acknowledge ? "#E74C3C" : "#95A5A6",
    EXPLAIN: "#F1C40F",
    APPROVE_SC: "#A8E6A3",
    APPROVE_QC: "#27AE60",
    APPROVE_FU: "#1ABC9C",
    CLOSE: "#95A5A6",
  };
  const stepColorMap: Record<string, string> = {
    EXPLAIN: "#F1C40F",
    COMPLAINT: "#4A90E2"

  };

  const getStatusColor = () => {
    // console.log("props.acknowledge",props.acknowledge);
    
    if (!props.label) return defaultColor;
    if (props.type === "step") {
    return stepColorMap[props.label] || defaultColor;
  }

  return allColorMap[props.label] || defaultColor;
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

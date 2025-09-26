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
    NEW: "#66bb6a",
    SUBMIT: props.acknowledge ? "#B3B3B3" : "#FFE8A3",
    EXPLAIN: "#FCA437",
    APPROVE_SC: "#FE97B0",
    APPROVE_QC: "#96F8E0",
    APPROVE_FU: "#E4CCFF",
    CLOSE: "#B3B3B3",
  };
  const stepColorMap: Record<string, string> = {
    EXPLAIN: "#00FF00",
    COMPLAINT: "#FF6347"

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

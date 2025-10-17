import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface BasicChips {
  label?: string;
  acknowledge?: boolean;
  step?: string;
  backgroundColor?: string;
  borderColor?: string;
  type?: "status" | "step";
}

const defaultColor = "#B3B3B3";
const unread = "#FE97B0";

export default function BasicChips(props: BasicChips) {

  const allColorMap: Record<string, string> = {
    NEW: "#7db6fa",
    SUBMIT: props.acknowledge ? "#7db6fa" : "#FF6B7A",
    EXPLAIN: "#F1C40F",
    APPROVE_SC: "#85d47f",
    APPROVE_QC: "#27AE60",
    APPROVE_FU: "#1ABC9C",
    CLOSE: "#95A5A6",
  };
  const stepColorMap: Record<string, string> = {
    EXPLAIN: "#F1C40F",
    COMPLAINT: "#7db6fa"

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
              color: "#ffffff",
              borderColor: props.borderColor || statusColor,
            }}
          />
        </Stack>
      </Box>

    </>
  );
}

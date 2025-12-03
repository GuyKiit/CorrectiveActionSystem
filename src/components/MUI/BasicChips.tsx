import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface BasicChips {
  label?: string;
  acknowledge?: boolean;
  step?: string;
  role?: string;
  approveseq?: string;
  userdept?: number;
  requestdept?: number;
  backgroundColor?: string;
  borderColor?: string;
  type?: "status" | "step";
}

const defaultColor = "#B3B3B3";
const unread = "#FE97B0";

export default function BasicChips(props: BasicChips) {

  console.log("💚💚💚💚 BasicChips props:", props);

  const allColorMap: Record<string, string> = {
    NEW: "#7db6fa",
    SUBMITED: props.role !== "section_head" && props.role !== "qc" && props.step === "COMPLAINT" && !props.acknowledge ? "#FF6B7A"
              : props.role !== "section_head" && props.role !== "qc" && props.step === "EXPLAIN" && !props.acknowledge ? "#FF6B7A"
              : props.role !== "section_head" && props.role !== "qc" && props.step === "EXPLAIN" && props.acknowledge ? "#7db6fa"
              : "#95A5A6",
    // SUBMITED: props.role === "user" && props.step === "COMPLAINT" && !props.acknowledge ? "#FF6B7A"
    //           : props.role === "user" && props.step === "EXPLAIN" && !props.acknowledge ? "#FF6B7A"
    //           : props.role === "user" && props.step === "EXPLAIN" && props.acknowledge ? "#7db6fa"
    //           : "#95A5A6",
    EXPLAINED: props.step === "EXPLAIN" && props.role === "section_head" ? "#F1C40F" : "#95A5A6",
    APPROVED: props.role === "qc" && props.approveseq === "1" ? "#85d47f"
              : props.role !== "section_head" && props.role !== "qc" && props.step === "COMPLAINT" && props.approveseq === "2" ? "#27AE60"
              : "#95A5A6",
    CLOSED: "#95A5A6",
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

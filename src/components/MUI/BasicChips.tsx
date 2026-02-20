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
  isApproveStepMax?: boolean;
  isAllowedTypeSingle?: boolean;
}

const defaultColor = "#B3B3B3";
const unread = "#FE97B0";

export default function BasicChips(props: BasicChips) {

  // console.log("💚💚💚💚 BasicChips props:", props);

  const allColorMap: Record<string, string> = {
    NEW: "#7db6fa",
    SUBMITED: props.role !== "section_head" && props.role !== "qc" &&  props.step === "COMPLAINT" && !props.acknowledge ? "#FF6B7A"
              : props.role !== "section_head" && props.role !== "qc" && props.step === "EXPLAIN" && !props.acknowledge ? "#FF6B7A"
              : props.role !== "section_head" && props.role !== "qc" && props.step === "EXPLAIN" && props.acknowledge ? "#7db6fa"
              : "#95A5A6",
    EXPLAINED: props.role === "section_head" && props.step === "EXPLAIN" ? "#F1C40F" : "#95A5A6",
    APPROVED: props.isAllowedTypeSingle && props.role === "user" ? "#85d47f" // หากถึงขั้นอนุมัติสูงสุดของรายการนั้นๆ (ปิดได้เลย) ให้เป็นสีเขียวเข้ม
        : !props.isAllowedTypeSingle && props.role === "qc" && !props.isApproveStepMax ? "#85d47f"    // หากเป็นแค่ขั้นระหว่างทาง (เช่นรอ QC) ให้เป็นสีเขียวอ่อน
        : !props.isAllowedTypeSingle && props.role === "user" && props.isApproveStepMax ? "#27AE60"    // หากเป็นแค่ขั้นระหว่างทาง (เช่นรอ QC) ให้เป็นสีเขียวอ่อน
        : "#95A5A6",
    CLOSED: "#95A5A6",
  };
  // #27AE60
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

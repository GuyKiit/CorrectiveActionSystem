//import { Button } from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { AnyPtrRecord } from "node:dns";
import { AnyIfEmpty } from "react-redux";
import { Button } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

type MUIIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">>;

type ButtonConfig = {
  IconComponent?: MUIIcon;
  colorname: string;
  onClick: () => void;
};

interface FullWidthButton {
  labelName: string | null;
  handleonClick: () => void;
  colorname: any;
  variant_text: "text" | "contained" | "outlined";
  IconComponent?: MUIIcon;

}


export default function FullWidthButton({ labelName, handleonClick, colorname = "success", IconComponent, variant_text = "contained" }: FullWidthButton) {

  return (
    <div>
      <Button
        endIcon={IconComponent ? <IconComponent /> : undefined}
        variant={variant_text}
        className="fs-6 py-2 "
        color={colorname}
        sx={{fontWeight:"bold"}}
        onClick={handleonClick}
        fullWidth
      >
        {labelName}
      </Button>
    </div>

  );
}
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, SvgIcon } from "@mui/material";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface ConfirmModal {
  createModal: (
    msg: string,
    msg1: string,
    msg2: string,
    name: string,
    type: 'validate' | 'confirm' | 'success',
    submit: () => void,
    cancel?: () => void
  ) => void;
}

let confirmModal: ConfirmModal;

interface MUIConfirmModal2 {
}

const ConfirmModal2: React.FC<MUIConfirmModal2> = () => {
  const [message, setMessage] = React.useState<any>();
  const [message1, setMessage1] = React.useState<any>();
  const [message2, setMessage2] = React.useState<any>();
  const [dialogName, setDialogName] = React.useState<any>();
  const [type, setType] = React.useState<any>();
  const [onSubmit, setOnSubmit] = React.useState<(() => void) | undefined>(undefined);
  const [onCancel, setOnCancel] = React.useState<(() => void) | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    confirmModal = {
      createModal: (
        msg: string,
        msg1: string,
        msg2: string,
        name: string,
        type: 'validate' | 'confirm' | 'success',
        submit: () => void,
        cancel?: () => void
      ) => {
        setMessage(msg);
        setMessage1(msg1);
        setMessage2(msg2);
        setDialogName(name);
        setType(type);
        setOnSubmit(() => submit);
        setOnCancel(cancel);
        setOpen(Boolean(submit));
      },
    };
  }, []);

  const handleClose = () => {
    setOnSubmit(undefined);
    setOpen(false);
  };

  const backgroundStyle = {backgroundImage: 'url(media/slider/close.png)', backgroundSize: 'cover', backgroundPosition: 'center', width: '150px', height: '150px', display: 'flex'};

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  if (open)
    return (
      <div>
        <Dialog open={open} maxWidth={"sm"} fullWidth>
          <DialogTitle>
            <label className={`sarabun-regular-Confirm`}>{dialogName}</label>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Stack alignItems="center" py={3}>
                {type === "confirm" ? (
                  <div
                    className="col-md-12 mb-5"
                    style={{
                      backgroundImage: 'url(media/slider/alert-sign.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '150px',
                      height: '150px',
                      display: 'flex',
                    }}
                  ></div>
                ) : type === "success" ? (
                  <div
                    className="col-md-12 mb-5"
                    style={{
                      backgroundImage: 'url(media/slider/success.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '150px',
                      height: '150px',
                      display: 'flex',
                    }}
                  ></div>
                ) : (
                  <div
                    className="col-md-12 mb-5"
                    style={{
                      backgroundImage: 'url(media/slider/close.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '150px',
                      height: '150px',
                      display: 'flex',
                    }}
                  ></div>
                )}
                <label className={`sarabun-regular-Confirm`}>{message}</label>
                <label className={`sarabun-regular-Confirm`}>{message1}</label>
                <label className={`sarabun-regular-Confirm`}>{message2}</label>
              </Stack>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {type == "confirm" && (
              <div className=" pr-2 pb-5">
                <Button
                  variant="contained" className="fs-6 py-2"
                  color={"success"}
                  onClick={() => {
                    if (onSubmit) {
                      onSubmit();
                    }
                    handleClose();
                  }}
                  autoFocus
                >
                  ตกลง
                </Button>
              </div>
            )}
            <div className=" pr-5 pb-5">
              <Button
                variant="contained" className="fs-6 py-2"
                color={"inherit"}
                onClick={handleClose}
              >
                ปิด
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
};

export default ConfirmModal2;
export { confirmModal };
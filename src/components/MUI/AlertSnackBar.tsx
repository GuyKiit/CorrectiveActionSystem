import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
 
interface ISnackbarState {
  open: boolean;
  duration: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
 
let ComponentSnackBar: {
  setState: (newState: ISnackbarState) => void;
};
 
export default function SnackBarDiaLog() {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
 
  useEffect(() => {
    ComponentSnackBar = {
      setState: (newState: ISnackbarState) => {
        setOpen(newState.open);
        setDuration(newState.duration);
        setMessage(newState.message);
        setType(newState.type);
      },
    };
  }, []);
 
  const handleClose = () => {
    setOpen(false);
  };
 
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      message={message}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert onClose={handleClose}  variant="filled" severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
 
export function SnackbarSet(msg = '', type: 'success' | 'error' | 'warning' | 'info' = 'success', duration = 3000) {
  ComponentSnackBar.setState({
    open: true,
    duration: duration,
    message: msg,
    type: type,
  });
}
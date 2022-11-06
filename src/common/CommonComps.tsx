import { Snackbar, SnackbarCloseReason } from "@mui/material";

export function Toastify({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void;
}) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      message={message}
      key={"topright"}
    />
  );
}

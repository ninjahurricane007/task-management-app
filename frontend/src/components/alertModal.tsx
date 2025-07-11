import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type AlertModalProps = {
  title: string;
  contentText: string;
  open: boolean;
  yesText: string;
  noText: string;
  handleYes: () => void;
  handleClose: () => void;
};

export default function AlertModal({
  title,
  contentText,
  open,
  yesText,
  noText,
  handleYes,
  handleClose,
}: AlertModalProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {noText}
        </Button>
        <Button variant="contained" onClick={handleYes} autoFocus>
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

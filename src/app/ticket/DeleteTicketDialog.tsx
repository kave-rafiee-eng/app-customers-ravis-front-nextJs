import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DeleteTicketDialogProps = {
  open: boolean;
  deleting: boolean;
  userPhone?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteTicketDialog({
  open,
  deleting,
  userPhone,
  onClose,
  onConfirm,
}: DeleteTicketDialogProps) {
  return (
    <Dialog open={open} onClose={() => !deleting && onClose()}>
      <DialogTitle>delete ticket</DialogTitle>
      <DialogContent>
        <DialogContentText>
          are you sure you want to delete this ticket from user{" "}
          <strong>{userPhone || "unknown"}</strong>? this action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
        >
          {deleting ? "deleting..." : "delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

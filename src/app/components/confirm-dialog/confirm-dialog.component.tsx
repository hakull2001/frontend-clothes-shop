import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

type PropTypes = {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

const ConfirmDialog: React.FC<PropTypes> = (props) => {
  const { title, children, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions style={{ margin: "1em" }}>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          color="default"
        >
          Không
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
        >
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;

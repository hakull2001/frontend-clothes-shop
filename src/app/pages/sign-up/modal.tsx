import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
  DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
const CustomModal = ({
  isOpen, 
  handleClose,
  title,
  children
}) => {
  return(
      <>
      <Dialog fullWidth maxWidth='md' open={isOpen} onClose={handleClose} aria-labelledby='max-width-dialog-title'>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
              <DialogContentText></DialogContentText>
              {children}
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color = 'primary'>
                  Close
              </Button>
          </DialogActions>
          </Dialog>
      </>
  )
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export default CustomModal;
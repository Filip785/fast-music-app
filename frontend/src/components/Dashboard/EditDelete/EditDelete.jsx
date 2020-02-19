import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Edit, Delete } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { deleteAudio } from '../../../state/actions';
import { toggleLoadSpinner } from '../../../state/load/load.actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditDelete(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const { audioId, userId, userApiToken, isArtists, artistId } = props;
  
  const handleDelete = () => {
    dispatch(toggleLoadSpinner());
    dispatch(deleteAudio(audioId, userId, userApiToken, isArtists, artistId));
    handleClose();
  };

  return (
    <>
      <div style={{marginBottom: '20px'}}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          component={Link}
          to={`/edit-audio-item/${audioId}`}
          startIcon={<Edit />}
        >
          Edit item
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="medium"
          onClick={handleClickOpen}
          startIcon={<Delete />}
          style={{marginLeft: '20px'}}
        >
          Delete item
        </Button>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Delete this song?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Deleting this song will delete it forever, and the only way to hear it again is to re-add it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={handleDelete} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
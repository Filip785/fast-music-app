import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toggleAddArtistDialog, createArtist } from '../../state/actions/index';
import { Button, TextField } from '@material-ui/core';

const mapStateToProps = state => ({
  addArtistDialogOpen: state.artistReducer.addArtistDialogOpen,
  addArtistFailure: state.artistReducer.addArtistFailure
});

class ConnectedAddArtistDialog extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleAddArtistEv = this.handleAddArtist.bind(this);
  }

  handleAddArtist() {
    this.props.createArtist(this.props.artistName, this.props.userApiToken);
  }

  render() {
    const { addArtistDialogOpen, artistName, addArtistFailure } = this.props;

    return (
      <Dialog open={addArtistDialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new artist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new artist, please enter it in the field below. Please don't add duplicates.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="artistName"
            label="Artist Name"
            type="text"
            value={artistName}
            error={Boolean(addArtistFailure.message)}
            helperText={addArtistFailure.message}
            onChange={this.props.handleChangeArtistNameEv}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleToggleDialogEv} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAddArtistEv} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(mapStateToProps, { toggleAddArtistDialog, createArtist }) (ConnectedAddArtistDialog);
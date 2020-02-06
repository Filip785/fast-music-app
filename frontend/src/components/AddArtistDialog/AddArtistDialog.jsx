import React from 'react';
import { connect } from 'react-redux';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  TextField 
} from '@material-ui/core';
import { toggleAddArtistDialog, createArtist } from '../../state/actions';

const mapStateToProps = state => ({
  addArtistDialogOpen: state.artistReducer.addArtistDialogOpen,
  addArtistFailure: state.artistReducer.addArtistFailure,
  withNotice: state.artistReducer.withNotice,
});

class ConnectedAddArtistDialog extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleAddArtistEv = this.handleAddArtist.bind(this);
  }

  handleAddArtist() {
    this.props.createArtist(this.props.artistName, this.props.userApiToken, this.props.onBlurAddItemForm);
  }

  render() {
    const { addArtistDialogOpen, artistName, addArtistFailure, withNotice } = this.props;
    return (
      <Dialog open={addArtistDialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new artist</DialogTitle>
        <DialogContent>
        {withNotice && <p><strong>Entered artist is not yet in our database.</strong></p>}
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

export default connect(mapStateToProps, { 
  toggleAddArtistDialog, 
  createArtist 
}) (ConnectedAddArtistDialog);
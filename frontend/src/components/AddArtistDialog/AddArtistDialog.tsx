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
import { toggleAddArtistDialog, createArtist } from '../../state/artist/artist.action';
import { toggleLoadSpinner } from '../../state/load/load.actions';
import { ArtistErrors, ArtistBlurType } from '../../state/artist/artist.types';

interface Props {
  artistName: string;
  userApiToken: string;
  addArtistDialogOpen: boolean;
  addArtistFailure: ArtistErrors;
  withNotice: boolean;
  handleChangeArtistName: (event: React.ChangeEvent<HTMLInputElement>, value?: { artistName: string }) => void;
  handleToggleDialog: (params: { withNotice: boolean }) => void;
  onBlurAddItemForm: (target: ArtistBlurType) => void;
  toggleLoadSpinner: () => void;
  createArtist: (artistName: string, userApiToken: string, onBlurAddItemForm: (target: ArtistBlurType) => void) => void;
}

interface State {}

const mapStateToProps = (state: any) => ({
  addArtistDialogOpen: state.artistReducer.addArtistDialogOpen,
  addArtistFailure: state.artistReducer.addArtistFailure,
  withNotice: state.artistReducer.withNotice,
});

class ConnectedAddArtistDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.handleAddArtist = this.handleAddArtist.bind(this);
  }

  handleAddArtist() {
    this.props.toggleLoadSpinner();
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
            onChange={this.props.handleChangeArtistName}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleToggleDialog({ withNotice: false })} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAddArtist} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(mapStateToProps, { 
  toggleAddArtistDialog, 
  createArtist,
  toggleLoadSpinner
}) (ConnectedAddArtistDialog);
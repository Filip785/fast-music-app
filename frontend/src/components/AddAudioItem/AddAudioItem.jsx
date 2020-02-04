import React, { Fragment } from 'react';
import { Paper, Grid, TextField, Button, Container, Snackbar } from '@material-ui/core';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddArtistDialog from '../AddArtistDialog/AddArtistDialog';
import PublishIcon from '@material-ui/icons/Publish';
import Alert from '@material-ui/lab/Alert';
import { getArtists, toggleAddArtistDialog, toggleFileChange, closeFileNotAllowedPrompt } from '../../state/actions/index';

const mapStateToProps = state => ({
  artists: state.artistReducer.artists,
  user: state.authReducer.user.authUser,
  musicFile: state.audioReducer.musicFile,
  fileExtensionNotAllowed: state.audioReducer.fileExtensionNotAllowed
});

class ConnectedAddAudioItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      artistName: '',
      fileName: ''
    };

    this.handleAddEv = this.handleAdd.bind(this);
    this.handleChangeTitleEv = this.handleChangeTitle.bind(this);
    this.handleChangeArtistNameEv = this.handleChangeArtistName.bind(this);

    this.handleToggleDialogEv = this.handleToggleDialog.bind(this);
    this.handleFileChangeEv = this.handleFileChange.bind(this);
    this.handleCloseFileNotAllowedPromptEv = this.handleCloseFileNotAllowedPrompt.bind(this);
  }

  componentDidMount() {
    this.props.getArtists(this.props.user.api_token);
  }

  handleAdd() {
    const { title, artistName } = this.state;
    console.log(`title: ${title}, artist name: ${artistName}`);
  }

  handleToggleDialog() {
    this.props.toggleAddArtistDialog();
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeArtistName(event) {
    this.setState({ artistName: event.target.value });
  }

  handleFileChange(event) {
    const targetFile = event.target.files[0];
    this.props.toggleFileChange(targetFile.name, targetFile.size, targetFile.type, event.target);
  }

  handleCloseFileNotAllowedPrompt() {
    this.props.closeFileNotAllowedPrompt();
  }

  render() {
    const { title, artistName } = this.state;
    const { artists, user, musicFile, fileExtensionNotAllowed } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <div>
            <Grid container spacing={8} justify="center">
              <h1>Add new song</h1>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="title" label="Song Title" type="text" value={title} onChange={this.handleChangeTitleEv} fullWidth autoFocus />
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              <Grid container direction="column" alignItems="flex-start" item md={true} sm={true} xs={true}>
                <Autocomplete
                  id="autocomplete-artist"
                  style={{ width: '100%' }}
                  freeSolo
                  options={artists.map(item => item.artistName)}
                  renderInput={params => (
                    <TextField {...params} label="Artist Name" margin="normal" fullWidth value={artistName} onChange={this.handleChangeArtistNameEv} />
                  )}
                />
                <Button color="primary" onClick={this.handleToggleDialogEv}>Add New Artist</Button>
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid container alignItems="flex-start" direction="column" item md={true} sm={true} xs={true}>
                <Fragment>
                  <input
                    color="primary"
                    type="file"
                    id="icon-button-file"
                    style={{ display: 'none', }}
                    onChange={this.handleFileChangeEv}
                  />
                  <label htmlFor="icon-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      size="large"
                      color="primary"
                    >
                      <PublishIcon />
                      <span style={{paddingLeft: '10px'}}>Add Audio File</span>
                    </Button>
                  </label>
                </Fragment>
                {musicFile.name && <div style={{width: '100%', textAlign: 'left'}}>
                  <Paper className="paperPaddingFileUpload">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <div>{musicFile.name}</div>
                      <div>{musicFile.size}</div>
                    </div>
                  </Paper>
                </div>}
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleAddEv}>Add</Button>
            </Grid>
          </div>
        </Paper>

        <AddArtistDialog handleToggleDialogEv={this.handleToggleDialogEv} handleChangeArtistNameEv={this.handleChangeArtistNameEv} artistName={artistName} userApiToken={user.api_token} />
        <Snackbar open={fileExtensionNotAllowed} autoHideDuration={3500} onClose={this.handleCloseFileNotAllowedPromptEv}>
          <Alert severity="error">
            Please only upload .mp3 and .wav files! Thanks.
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { getArtists, toggleAddArtistDialog, toggleFileChange, closeFileNotAllowedPrompt })(ConnectedAddAudioItem);
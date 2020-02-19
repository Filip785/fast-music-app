import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddArtistDialog from '../AddArtistDialog/AddArtistDialog';
import PublishIcon from '@material-ui/icons/Publish';
import Alert from '@material-ui/lab/Alert';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Container,
  Snackbar,
  Radio,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  FormControl
} from '@material-ui/core';
import {
  getArtists,
  toggleAddArtistDialog,
  addOrEditAudioItem,
  cleanupAddFilePage,
  getSpecificUsers,
  getAudioItem
} from '../../state/actions';
import {
  toggleFileChange,
  closeFileNotAllowedPrompt
} from '../../state/audio/audio.action';
import { toggleLoadSpinner } from '../../state/load/load.actions';

const mapStateToProps = state => ({
  user: state.authReducer.user.authUser,
  artists: state.artistReducer.artists,
  addArtistDialogOpen: state.artistReducer.addArtistDialogOpen,
  specificUsers: state.audioReducer.specificUsers,
  musicItem: state.audioReducer.musicItem,
  fileUpload: state.audioReducerTs.fileUpload
});

class ConnectedAddEditAudioItem extends React.Component {
  constructor(props) {
    super(props);

    const { type } = this.props;

    this.state = {
      dataLoaded: type === 'add' ? true : false,
      title: '',
      artistName: '',
      fileName: '',
      visibility: 0,
    };

    this.selectedArtist = {};
    this.selectedUsers = [];
    this.defaultUsers = [];

    this.handleSubmitEv = this.handleSubmit.bind(this);
    this.handleChangeTitleEv = this.handleChangeTitle.bind(this);
    this.handleChangeArtistNameEv = this.handleChangeArtistName.bind(this);

    this.handleToggleDialogEv = this.handleToggleDialog.bind(this);
    this.handleFileChangeEv = this.handleFileChange.bind(this);
    this.handleCloseFileNotAllowedPromptEv = this.handleCloseFileNotAllowedPrompt.bind(this);
    this.handleBlurArtistNameEv = this.handleBlurArtistName.bind(this);
    this.handleVisibilityChangeEv = this.handleVisibilityChange.bind(this);
    this.handleAllowedUserEv = this.handleAllowedUser.bind(this);
  }

  setupEditPage(musicItem) {
    this.selectedArtist = musicItem.artist;
    if (musicItem.visibility === 2) {
      this.selectedUsers = musicItem.allowed_users.map(item => ({ id: item.id, username: item.username }));
      this.defaultUsers = this.selectedUsers;
    }
    this.setState({
      dataLoaded: true,
      title: musicItem.songTitle,
      artistName: this.selectedArtist.artistName,
      visibility: musicItem.visibility
    });
  }

  componentDidMount() {
    const { type } = this.props;

    if (type === 'edit') {
      this.props.toggleLoadSpinner();
    }
    this.props.getArtists(this.props.user.api_token).then(() => {
      if (type === 'edit') {
        const { id } = this.props.match.params;

        this.props.getAudioItem(this.props.user.id, id, this.props.user.api_token).then(() => {
          const { musicItem } = this.props;

          // specific users only
          if (musicItem.visibility === 2) {
            this.props.getSpecificUsers(this.props.user.id, this.props.user.api_token).then(() => {
              this.setupEditPage(musicItem);
              this.props.toggleLoadSpinner();
            });
          } else {
            this.props.toggleLoadSpinner();
            this.setupEditPage(musicItem);
          }
        }, () => { });
      }
    });
  }

  componentWillUnmount() {
    this.selectedArtist = {};
    this.props.cleanupAddFilePage();
  }

  handleSubmit() {
    const { title, visibility } = this.state;
    const { musicFile, type, musicItem } = this.props;

    this.props.toggleLoadSpinner();

    let method = 'post';
    let action = '/add';

    if (type === 'edit') {
      method = 'put';
      action = `/edit/${musicItem.id}`;
    }

    this.props.addOrEditAudioItem({
      method, action
    }, title, this.selectedArtist.id, {
      fileName: musicFile.name,
      fileUpload: musicFile.fileUpload
    }, this.props.user.id, visibility, this.selectedUsers.map(x => x.id), this.props.user.api_token);
  }

  handleToggleDialog({ withNotice }) {
    const { addArtistDialogOpen } = this.props;

    // dialog is gonna close
    if (addArtistDialogOpen) {
      this.setState({ artistName: '' });
    }

    this.props.toggleAddArtistDialog(withNotice);
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeArtistName(event, value) {
    this.setState({ artistName: value ? value.artistName : event.target.value });
  }

  handleVisibilityChange(event) {
    const { specificUsers } = this.props;

    const value = Number(event.target.value);
    this.setState({ visibility: value });

    // only specific users
    if (value === 2 && specificUsers.length === 0) {
      this.props.getSpecificUsers(this.props.user.id, this.props.user.api_token);
    }

    if (value !== 2) {
      this.selectedUsers = [];
    }
  }

  handleFileChange(event) {
    const targetFile = event.target.files[0];
    this.props.toggleFileChange(targetFile.name, targetFile.size, targetFile.type, event.target);
  }

  handleCloseFileNotAllowedPrompt() {
    this.props.closeFileNotAllowedPrompt();
  }

  handleBlurArtistName(event) {
    const artistNameValue = event.target.value.trim();

    if (artistNameValue === '') {
      this.selectedArtist = {};

      return;
    }

    this.selectedArtist = this.props.artists.find(item => item.artistName.toLowerCase().includes(event.target.value.toLowerCase())) || {};

    if (!this.selectedArtist.id) {
      this.handleToggleDialog({ withNotice: true });

      return;
    }

    this.setState({ artistName: this.selectedArtist.artistName });
  }

  handleAllowedUser(_, value) {
    this.selectedUsers = value;
  }

  render() {
    const { title, artistName, visibility, dataLoaded } = this.state;
    const { artists, user, fileUpload, specificUsers, type } = this.props;
    
    const { musicFile, musicFileErrors } = fileUpload;

    return (
      <Container maxWidth="sm">
        {dataLoaded && <Paper className="paperPadding">
          <Grid container spacing={8} jus1tify="center">
            <h1>{type === 'add' ? ('Add new song') : ('Edit this song')}</h1>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="title" label="Song Title" type="text" error={Boolean(musicFileErrors.songTitle)} helperText={musicFileErrors.songTitle} value={title} onChange={this.handleChangeTitleEv} fullWidth autoFocus />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid container direction="column" alignItems="flex-start" item md={true} sm={true} xs={true}>
              <Autocomplete
                id="autocomplete-artist"
                style={{ width: '100%' }}
                options={artists}
                getOptionLabel={option => option.artistName}
                onChange={this.handleChangeArtistNameEv}
                onBlur={this.handleBlurArtistNameEv}
                renderInput={params => {
                  // temporary fix, probably bug in material-ui (TextField not updating value)
                  params.inputProps.value = artistName;
                  return (
                    <TextField value={this.state.artistName} {...params} error={Boolean(musicFileErrors.artistId)} helperText={musicFileErrors.artistId} label="Artist Name" name="artistName" margin="normal" fullWidth onChange={this.handleChangeArtistNameEv} />
                  );
                }}
              />
              <Button color="primary" onClick={this.handleToggleDialogEv}>Add New Artist</Button>
            </Grid>
          </Grid>
          {type !== 'edit' && <Grid container spacing={8} alignItems="flex-end">
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
                    <span style={{ paddingLeft: '10px' }}>Add Audio File</span>
                  </Button>
                </label>
              </Fragment>
              {musicFileErrors.fileUpload && <div><p style={{ color: 'red' }}>{musicFileErrors.fileUpload}</p></div>}
              {musicFile.name && <div style={{ width: '100%', textAlign: 'left' }}>
                <Paper className="paperPaddingFileUpload">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{musicFile.name}</div>
                    <div>{musicFile.size}</div>
                  </div>
                </Paper>
              </div>}
            </Grid>
          </Grid>}

          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <FormControl style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <FormLabel style={{ fontWeight: 'bold' }} component="legend">This item will be visible to:</FormLabel>

                <RadioGroup style={{ display: 'flex', flexDirection: 'row' }} value={visibility} defaultValue={0} onChange={this.handleVisibilityChangeEv}>
                  <FormControlLabel
                    value="0"
                    control={<Radio checked={visibility === 0} color="primary" />}
                    label="Everyone"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio checked={visibility === 1} color="primary" />}
                    label="Just me"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio checked={visibility === 2} color="primary" />}
                    label="Specific users"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>

              {visibility === 2 && <Autocomplete
                multiple
                id="specific-users"
                options={specificUsers}
                getOptionLabel={user => user.username}
                onChange={this.handleAllowedUserEv}
                defaultValue={type === 'add' ? [] : this.defaultUsers}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(musicFileErrors.allowedUsers)}
                    helperText={musicFileErrors.allowedUsers}
                    label="Pick users who should see this item"
                    placeholder="Users"
                    fullWidth
                  />
                )}
              />}
            </Grid>
          </Grid>

          <Grid container justify="center" style={{ marginTop: '25px' }}>
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmitEv}>
              {type === 'add' ? ('Add') : ('Edit')}
            </Button>
          </Grid>
        </Paper>}

        <AddArtistDialog handleToggleDialogEv={this.handleToggleDialogEv} handleChangeArtistNameEv={this.handleChangeArtistNameEv} artistName={artistName} userApiToken={user.api_token} onBlurAddItemForm={this.handleBlurArtistNameEv} />
        <Snackbar open={musicFileErrors.fileExtensionNotAllowed} autoHideDuration={3500} onClose={this.handleCloseFileNotAllowedPromptEv}>
          <Alert severity="error">
            Please only upload .mp3 and .wav files! Thanks.
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default connect(mapStateToProps, {
  getArtists,
  toggleAddArtistDialog,
  toggleFileChange,
  closeFileNotAllowedPrompt,
  addOrEditAudioItem,
  cleanupAddFilePage,
  toggleLoadSpinner,
  getSpecificUsers,
  getAudioItem
})(ConnectedAddEditAudioItem);
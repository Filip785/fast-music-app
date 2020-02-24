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
import { getSpecificUsers, cleanupAddFilePage, getAudioItem, addOrEditAudioItem } from '../../state/audio/audio.action';
import { getArtists, toggleAddArtistDialog } from '../../state/artist/artist.action';
import {
  toggleFileChange,
  closeFileNotAllowedPrompt
} from '../../state/audio/audio.action';
import { toggleLoadSpinner } from '../../state/load/load.actions';
import { User } from '../../state/auth/auth.types';
import { FileUpload, ItemFileUpload, AudioFileActionTypes, FileUploadPage } from '../../state/audio/audio.types';
import { Artist, ArtistBlurType } from '../../state/artist/artist.types';

interface Props {
  type: string;
  user: User;
  match: { params: { id: number } };
  fileUpload: FileUpload;
  addArtistDialogOpen: boolean;
  specificUsers: User[];
  artists: Artist[];
  musicItem: ItemFileUpload;

  getSpecificUsers: (userId: number, userApiToken: string) => Promise<void>;
  getAudioItem: (userId: number, audioItemId: number, userApiToken: string) => Promise<void>;
  getArtists: (userApiToken: string) => Promise<void>;
  toggleLoadSpinner: () => void;
  cleanupAddFilePage: () => void;
  toggleAddArtistDialog: (withNotice: boolean) => void;
  closeFileNotAllowedPrompt: () => void;
  toggleFileChange: (name: string, size: number, fileType: string, file: HTMLInputElement) => AudioFileActionTypes;
  addOrEditAudioItem: (
    requestData: { action: string, method: string },
    title: string,
    artistId: number,
    fileData: FileUploadPage,
    userId: number,
    visibility: number,
    selectedUsers: User[],
    userApiToken: string
  ) => void;
}

interface State {
  dataLoaded: boolean;
  title: string;
  artistName: string;
  fileName: string;
  visibility: number;
}

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user.authUser,
  artists: state.artistReducer.artists,
  addArtistDialogOpen: state.artistReducer.addArtistDialogOpen,
  specificUsers: state.audioReducerTs.specificUsers,
  musicItem: state.audioReducerTs.musicItem,
  fileUpload: state.audioReducerTs.fileUpload
});

class ConnectedAddEditAudioItem extends React.Component<Props, State> {
  selectedArtist: Artist = {};
  selectedUsers: User[] = [];
  defaultUsers: User[] = [];

  constructor(props: Props) {
    super(props);

    const { type } = this.props;

    this.state = {
      dataLoaded: type === 'add' ? true : false,
      title: '',
      artistName: '',
      fileName: '',
      visibility: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeArtistName = this.handleChangeArtistName.bind(this);

    this.handleToggleDialog = this.handleToggleDialog.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleCloseFileNotAllowedPrompt = this.handleCloseFileNotAllowedPrompt.bind(this);
    this.handleBlurArtistName = this.handleBlurArtistName.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleAllowedUser = this.handleAllowedUser.bind(this);
  }

  setupEditPage(musicItem: ItemFileUpload) {
    this.selectedArtist = musicItem.artist;
    if (musicItem.visibility === 2) {
      this.selectedUsers = musicItem.allowed_users.map((item: User) => item);
      this.defaultUsers = this.selectedUsers;
    }
    this.setState({
      dataLoaded: true,
      title: musicItem.songTitle,
      artistName: this.selectedArtist.artistName!,
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
    this.selectedArtist = { id: 0, artistName: '' };
    this.props.cleanupAddFilePage();
  }

  handleSubmit() {
    const { title, visibility } = this.state;
    const { fileUpload, type, musicItem } = this.props;

    this.props.toggleLoadSpinner();

    let method = 'post';
    let action = '/add';

    if (type === 'edit') {
      method = 'put';
      action = `/edit/${musicItem.id}`;
    }
    
    this.props.addOrEditAudioItem({
      method, action
    }, title, this.selectedArtist.id!, {
      fileName: fileUpload.musicFile.name!,
      fileUpload: fileUpload.musicFile.fileResult!
    }, this.props.user.id, visibility, this.selectedUsers, this.props.user.api_token);
  }

  handleToggleDialog(params: { withNotice: boolean }) {
    const { addArtistDialogOpen } = this.props;

    const { withNotice } = params;

    // dialog is gonna close
    if (addArtistDialogOpen) {
      this.setState({ artistName: '' });
    }

    this.props.toggleAddArtistDialog(withNotice);
  }

  handleChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ title: event.target.value });
  }

  handleChangeArtistName(event: React.ChangeEvent<{}>, value?: { artistName: string } | Artist) {
    this.setState({ artistName: value?.artistName! });
  }

  handleVisibilityChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const targetFile = event.target.files![0];
    this.props.toggleFileChange(targetFile.name, targetFile.size, targetFile.type, event.target);
  }

  handleCloseFileNotAllowedPrompt() {
    this.props.closeFileNotAllowedPrompt();
  }

  handleBlurArtistName(event: React.ChangeEvent<HTMLInputElement> | ArtistBlurType) {
    const artistNameValue = event.target.value.trim();
    if (artistNameValue === '') {
      this.selectedArtist = { id: 0, artistName: '' };

      return;
    }

    this.selectedArtist = this.props.artists.find(item => item.artistName!.toLowerCase().includes(event.target.value.toLowerCase())) || { id: 0, artistName: '' };

    if (!this.selectedArtist.id) {
      this.handleToggleDialog({ withNotice: true });

      return;
    }

    this.setState({ artistName: this.selectedArtist.artistName! });
  }

  handleAllowedUser(_: React.ChangeEvent<{}>, value: User[]) {
    this.selectedUsers = value;
  }

  render() {
    const { title, artistName, visibility, dataLoaded } = this.state;
    const { artists, user, fileUpload, specificUsers, type } = this.props;
    
    const { musicFile, musicFileErrors } = fileUpload;

    return (
      <Container maxWidth="sm">
        {dataLoaded && <Paper className="paperPadding">
          <Grid container spacing={8} justify="center">
            <h1>{type === 'add' ? ('Add new song') : ('Edit this song')}</h1>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="title" label="Song Title" type="text" error={Boolean(musicFileErrors.songTitle)} helperText={musicFileErrors.songTitle} value={title} onChange={this.handleChangeTitle} fullWidth autoFocus />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid container direction="column" alignItems="flex-start" item md={true} sm={true} xs={true}>
              <Autocomplete
                id="autocomplete-artist"
                style={{ width: '100%' }}
                options={artists}
                getOptionLabel={option => option.artistName!}
                onChange={(event: React.ChangeEvent<{}>, value: Artist | null) => this.handleChangeArtistName(event, value!)}
                // @ts-ignore
                onBlur={this.handleBlurArtistName}
                renderInput={params => {
                  // temporary fix, probably bug in material-ui (TextField not updating value)
                  // @ts-ignore
                  params.inputProps.value = artistName;
                  
                  return (
                    <TextField 
                    value={this.state.artistName} 
                    {...params} 
                    error={Boolean(musicFileErrors.artistId)} 
                    helperText={musicFileErrors.artistId} 
                    label="Artist Name" 
                    name="artistName" 
                    margin="normal" 
                    fullWidth 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleChangeArtistName(event, { artistName: event.target.value })} />
                  );
                }}
              />
              <Button color="primary" onClick={() => this.handleToggleDialog({ withNotice: false })}>Add New Artist</Button>
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
                  onChange={this.handleFileChange}
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

                <RadioGroup style={{ display: 'flex', flexDirection: 'row' }} value={visibility} defaultValue={0} onChange={this.handleVisibilityChange}>
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
                onChange={(event, value: User[]) => {
                  this.handleAllowedUser(event, value);
                }}
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
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmit}>
              {type === 'add' ? ('Add') : ('Edit')}
            </Button>
          </Grid>
        </Paper>}

        <AddArtistDialog handleToggleDialog={this.handleToggleDialog} 
                         handleChangeArtistName={this.handleChangeArtistName} 
                         artistName={artistName} 
                         userApiToken={user.api_token}
                         onBlurAddItemForm={this.handleBlurArtistName} 
        />
        <Snackbar open={Boolean(musicFileErrors.fileExtensionNotAllowed)} autoHideDuration={3500} onClose={this.handleCloseFileNotAllowedPrompt}>
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
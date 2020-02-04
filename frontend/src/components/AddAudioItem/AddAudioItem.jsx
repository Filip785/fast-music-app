import React from 'react';
import { Paper, Grid, TextField, Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getArtists, toggleAddArtistDialog } from '../../state/actions/index';
import AddArtistDialog from '../AddArtistDialog/AddArtistDialog';

const mapStateToProps = state => ({
  artists: state.artistReducer.artists,
  user: state.authReducer.user.authUser
});

class ConnectedAddAudioItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      artistName: ''
    };

    this.handleAddEv = this.handleAdd.bind(this);
    this.handleChangeTitleEv = this.handleChangeTitle.bind(this);
    this.handleChangeArtistNameEv = this.handleChangeArtistName.bind(this);

    this.handleToggleDialogEv = this.handleToggleDialog.bind(this);

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

  render() {
    const { title, artistName } = this.state;
    const { artists, user } = this.props;

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
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleAddEv}>Add</Button>
            </Grid>
          </div>
        </Paper>

        <AddArtistDialog handleToggleDialogEv={this.handleToggleDialogEv} handleChangeArtistNameEv={this.handleChangeArtistNameEv} artistName={artistName} userApiToken={user.api_token} />
      </Container>
    );
  }
}

export default connect(mapStateToProps, { getArtists, toggleAddArtistDialog })(ConnectedAddAudioItem);
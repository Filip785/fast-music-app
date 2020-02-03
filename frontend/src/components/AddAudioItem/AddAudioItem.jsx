import React from 'react';
import { Paper, Grid, TextField, Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';

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
  }

  handleAdd() {
    const { title, artistName } = this.state;
    console.log(`title: ${title}, artist name: ${artistName}`);
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeArtistName(event) {
    this.setState({ artistName: event.target.value });
  }

  render() {
    const { title, artistName } = this.state;
    
    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <div>
            <Grid container spacing={8} justify="center">
              <h1>Add new song</h1>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="title" label="Song Title" type="text" value={title} onChange={this.handleChangeTitleEv} fullWidth autoFocus required />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="artistName" label="Artist Name" type="text" value={artistName} onChange={this.handleChangeArtistNameEv} fullWidth required />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleAddEv}>Add</Button>
            </Grid>
          </div>
        </Paper>
      </Container>
    );
  }
}

export default connect() (ConnectedAddAudioItem);
import React from 'react';
import { connect } from 'react-redux';
import { getAudioItemsForArtists, toggleItemArtistSongs } from '../../../state/actions';
import { ListItem, ListItemText, Collapse, List, Button, Divider } from '@material-ui/core';
import { ExpandLess, ExpandMore, ThumbUp, ThumbDown } from '@material-ui/icons';
import { Link } from 'react-router-dom';

const mapStateToProps = state => ({
  user: state.authReducer.user.authUser,
  artistAudioItems: state.audioReducer.artistAudioItems
});

class ConnectedSortByArtist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false
    };

    this.handleExpandEv = this.handleExpand.bind(this);
  }

  componentDidMount() {
    // call get artist songs
    const { user } = this.props;
    this.props.getAudioItemsForArtists(user.id, user.api_token).then(() => {
      this.setState({ dataLoaded: true });
    });
  }

  handleExpand(value) {
    this.props.toggleItemArtistSongs(value);
  }

  render() {
    const { dataLoaded } = this.state;
    const { artistAudioItems, user } = this.props;
    
    return (
      <div>
        {dataLoaded && (artistAudioItems.map(el => (
          <div key={el.id}>
            <ListItem button onClick={() => this.handleExpandEv(el.id)}>
              <ListItemText primary={el.artistName} />
              {el.toggle ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={el.toggle} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {el.audioItems.map(artistSong => (
                    <div key={artistSong.id} style={{width: '100%'}}>
                      {(user.id !== artistSong.uploader.id) && <Button
                        variant="contained"
                        component="span"
                        size="large"
                        color="primary"
                        style={{ marginBottom: '20px' }}
                        onClick={() => this.props.handleLikeEv(artistSong.id, el.id, true)}
                      >
                        {!artistSong.isLikedByUser ? <ThumbUp /> : <ThumbDown />}
                        <span style={{ paddingLeft: '10px' }}>{!artistSong.isLikedByUser ? ('Like this song') : ('Unlike this song')}</span>
                      </Button>}
                      <h3>Likes: {artistSong.likes}</h3>
                      <audio controls style={{ width: '100%' }}>
                        <source src={artistSong.url} />
                        Your browser does not support the audio element.
                    </audio>
                      <div style={{ marginTop: '20px' }}>
                        {(artistSong.uploader.id === user.id) && <div><Link to={`/edit-audio-item/${artistSong.id}`}>Edit item</Link></div>}Uploaded by <strong>{artistSong.uploader.name}</strong>
                      </div>
                      <Divider />

                    </div>
                  ))}
                </ListItem>
              </List>
            </Collapse>
          </div>
        )))}
      </div>
    );
  }
}

export default connect(mapStateToProps, { getAudioItemsForArtists, toggleItemArtistSongs })(ConnectedSortByArtist);
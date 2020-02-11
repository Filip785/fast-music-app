import React from 'react';
import { connect } from 'react-redux';
import { getAudioItemsForArtists, toggleItemArtistSongs } from '../../../state/actions';
import { ListItem, ListItemText, Collapse, List, Divider } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import LikeItem from '../LikeItem/LikeItem';
import EditDelete from '../EditDelete/EditDelete';

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
      <>
        {dataLoaded && (artistAudioItems.map(el => (
          <React.Fragment key={el.id}>
            <ListItem button onClick={() => this.handleExpandEv(el.id)}>
              <ListItemText primary={el.artistName} />
              {el.toggle ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={el.toggle} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {el.audioItems.map(artistSong => (
                    <div key={artistSong.id} style={{width: '100%'}}>
                      <div style={{padding: '20px'}}>
                        <h2>Song Name: {artistSong.songTitle}</h2>
                        <LikeItem numLikes={artistSong.likes} 
                                  userApiToken={user.api_token} 
                                  audioItemId={artistSong.id} 
                                  userId={user.id} 
                                  uploaderId={artistSong.uploader.id} 
                                  isLikedByUser={artistSong.isLikedByUser} 
                                  artistId={el.id} 
                          />
                        <audio controls style={{ width: '100%' }}>
                          <source src={artistSong.url} />
                          Your browser does not support the audio element.
                      </audio>
                        <div style={{ marginTop: '20px' }}>
                          {(artistSong.uploader.id === user.id) && <EditDelete audioId={artistSong.id} userId={user.id} userApiToken={user.api_token} isArtists={true} artistId={el.id} />}
                          Uploaded by <strong>{artistSong.uploader.name}</strong>
                        </div>
                      </div>
                      <Divider />

                    </div>
                  ))}
                </ListItem>
              </List>
            </Collapse>
          </React.Fragment>
        )))}
      </>
    );
  }
}

export default connect(mapStateToProps, { getAudioItemsForArtists, toggleItemArtistSongs })(ConnectedSortByArtist);
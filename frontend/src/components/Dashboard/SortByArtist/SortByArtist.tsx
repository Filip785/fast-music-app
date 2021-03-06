import React from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemText, Collapse, List, Divider } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import LikeItem from '../LikeItem/LikeItem';
import EditDelete from '../EditDelete/EditDelete';
import { User } from '../../../state/auth/auth.types';
import { toggleItemArtistSongs, getAudioItemsForArtists } from '../../../state/audio/audio.action';
import { AudioActionTypes, ArtistAudioItem } from '../../../state/audio/audio.types';
import { Link } from 'react-router-dom';

interface Props {
  audioItemsArtists: ArtistAudioItem[];
  user: User;
  toggleItemArtistSongs: (value: number) => AudioActionTypes;
  getAudioItemsForArtists: (userId: number, userApiToken: string) => Promise<void>;
}

interface State {
  dataLoaded: boolean;
}

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user.authUser,
  audioItemsArtists: state.audioReducerTs.audioItemsArtists
});

class ConnectedSortByArtist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dataLoaded: false
    };

    this.handleExpand = this.handleExpand.bind(this);
  }

  componentDidMount() {
    // call get artist songs
    const { user } = this.props;
    this.props.getAudioItemsForArtists(user.id, user.api_token).then(() => {
      this.setState({ dataLoaded: true });
    });
  }

  handleExpand(value: number): void {
    this.props.toggleItemArtistSongs(value);
  }

  render() {
    const { dataLoaded } = this.state;
    const { audioItemsArtists, user } = this.props;
    
    return (
      <>
        {dataLoaded && (audioItemsArtists.map(el => (
          <React.Fragment key={el.id}>
            <ListItem button onClick={() => this.handleExpand(el.id)}>
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
                          Uploaded by <Link to={`/profile/${artistSong.uploader.id}`}><strong>{artistSong.uploader.name}</strong></Link>
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
import React from 'react';
import { getProfileData, toggleLoadSpinner, toggleItem } from '../../state/actions';
import { connect } from 'react-redux';
import { ListItem, List, Collapse, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import LikeItem from '../Dashboard/LikeItem/LikeItem';
import { Link } from 'react-router-dom';

const mapStateToProps = state => ({
  profile: state.audioReducer.profile,
  user: state.authReducer.user.authUser,
});

class ConnectedProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false
    };

    this.handleExpandEv = this.handleExpand.bind(this);
  }

  componentDidMount() {
    this.props.toggleLoadSpinner();
    const profileId = this.props.match.params.id;
    const { id, api_token } = this.props.user;
    
    this.props.getProfileData(profileId, id, api_token).then(() => {
      this.setState({ dataLoaded: true });
      this.props.toggleLoadSpinner();
    });
  }

  handleExpand(value) {
    console.log('here');
    this.props.toggleItem(value);
  }

  render() {
    const { profile: { profileData, accessibleItems }, user } = this.props;
    const { dataLoaded } = this.state;

    console.log(accessibleItems);
    
    return (
      <div>
        {dataLoaded && <div>
          <h1>{profileData.name}'s Profile</h1>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{textAlign: 'left'}}>
              <h4>Creation Date: {profileData.accountCreationDate}</h4>
              <h4>Number of uploads: {profileData.numberOfUploads}</h4>  
            </div>

            <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            style={{width: '1200px'}}
          >
            {accessibleItems.map(audioItem => (
              <div key={audioItem.id}>
                <ListItem button onClick={() => this.handleExpandEv(audioItem.id)}>
                  <ListItemText primary={`${audioItem.artistName} - ${audioItem.songTitle}`} />
                  {audioItem.toggle ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={audioItem.toggle} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <LikeItem numLikes={audioItem.likes} userApiToken={user.api_token} audioItemId={audioItem.id} userId={user.id} uploaderId={profileData.id} isLikedByUser={audioItem.isLikedByUser} />

                      <audio controls style={{ width: '100%' }}>
                        <source src={audioItem.audioUrl} />
                        Your browser does not support the audio element.
                      </audio>
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
          </div>
        </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps, { getProfileData, toggleLoadSpinner, toggleItem }) (ConnectedProfile);
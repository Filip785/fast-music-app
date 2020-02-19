import React from 'react';
import { getProfileData, toggleItem } from '../../state/actions';
import { connect } from 'react-redux';
import AllSongsList from '../Dashboard/AllSongsList/AllSongsList';
import { toggleLoadSpinner } from '../../state/load/load.actions';

const mapStateToProps = state => ({
  profile: state.audioReducer.profile,
});

class ConnectedProfile extends React.Component {
  render() {
    const { profile } = this.props;
    const { id } = this.props.match.params;

    return (
      <>
        <h1>{profile.name}'s Profile</h1>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{textAlign: 'left'}}>
            <h4>Creation Date: {profile.accountCreationDate}</h4>
            <h4>Number of uploads: {profile.numberOfUploads}</h4>  
          </div>

          <AllSongsList isProfile={true} profileId={id} location={{}} />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, { getProfileData, toggleLoadSpinner, toggleItem }) (ConnectedProfile);
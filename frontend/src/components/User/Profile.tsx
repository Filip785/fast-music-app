import React from 'react';
import { connect } from 'react-redux';
import AllSongsList from '../Dashboard/AllSongsList/AllSongsList';
import { toggleLoadSpinner } from '../../state/load/load.actions';
import { Profile } from '../../state/audio/audio.types';

interface Props {
  profile: Profile;
  match: {
    params: {
      id: number
    }
  }
}

interface State {}

const mapStateToProps = (state: any) => ({
  profile: state.audioReducerTs.profile,
});

class ConnectedProfile extends React.Component<Props, State> {
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

export default connect(mapStateToProps, { toggleLoadSpinner }) (ConnectedProfile);
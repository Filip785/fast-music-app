import React, { useEffect, useState } from 'react';
import { ListItem, Collapse, List, ListItemText } from '@material-ui/core';
import LikeItem from '../LikeItem/LikeItem';
import { Link } from 'react-router-dom';
import EditDelete from '../EditDelete/EditDelete';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileData, toggleItem, toggleLoadSpinner, getAllAudioItems } from '../../../state/actions';
import history from '../../../helpers/history';

export default function AllSongsList(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const musicItems = useSelector(state => state.audioReducer.musicItems);
  const user = useSelector(state => state.authReducer.user.authUser);
  const dispatch = useDispatch();

  const { isProfile, profileId } = props;

  const handleExpand = (id) => {
    dispatch(toggleItem(id));
  };

  useEffect(() => {
    if (isProfile) {
      // load profile data
      dispatch(toggleLoadSpinner());
      dispatch(
        getProfileData(profileId, user.id, user.api_token)
      ).then(() => {
        setDataLoaded(true);
      });
    } else {
      // load dashboard 'all songs' data      
      if (!props.location.state) {
        dispatch(toggleLoadSpinner());
      } else {
        // clear location state history
        history.replace({ pathname: '/dashboard', state: null });
      }
      dispatch(getAllAudioItems(user.id, user.api_token)).then(() => {
        setDataLoaded(true);
      });
    }
  }, [profileId, user.id, user.api_token, dispatch, isProfile, props.location.state]);

  console.log('DOING');

  return (
    <>
      {dataLoaded && <>
        <div className="title">
          <h2>All Songs</h2>
        </div>

        <div className="list">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            style={{ width: '1200px' }}
          >
            {musicItems.length !== 0 ? musicItems.map(audioItem => (
              <React.Fragment key={audioItem.id}>
              
                <ListItem button onClick={() => handleExpand(audioItem.id)}>
                  <ListItemText primary={`${audioItem.artistName} - ${audioItem.songTitle}`} />
                  {audioItem.toggle ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={audioItem.toggle} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <LikeItem numLikes={audioItem.likes} userApiToken={user.api_token} audioItemId={audioItem.id} userId={user.id} uploaderId={audioItem.uploader.id} isLikedByUser={audioItem.isLikedByUser} />

                      <audio controls style={{ width: '100%' }}>
                        <source src={audioItem.url} />
                        Your browser does not support the audio element.
                      </audio>
                      <div style={{ marginTop: '20px' }}>
                        {(audioItem.uploader.id === user.id) && <EditDelete audioId={audioItem.id} userId={user.id} userApiToken={user.api_token} />}
                        {!isProfile && <>Uploaded by <Link to={`/profile/${audioItem.uploader.id}`}><strong>{audioItem.uploader.name}</strong></Link></>}
                      </div>
                    </ListItem>
                  </List>
                </Collapse>
              
              </React.Fragment>
            )) : <h2>Nothing to show here.</h2>}
          </List>
        </div>
      </>}
    </>
  );
}
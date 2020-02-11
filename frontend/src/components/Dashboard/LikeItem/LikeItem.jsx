import React from 'react';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { doLike, toggleLoadSpinner } from '../../../state/actions';

export default function LikeItem(props) {
  const dispatch = useDispatch();
  
  return (
    <>
      {(props.userId !== props.uploaderId) && <Button
        variant="contained"
        component="span"
        size="large"
        color="primary"
        style={{marginTop: '20px', marginBottom: '20px'}}
        onClick={() => {
          dispatch(doLike(props.audioItemId, props.userId, props.userApiToken, Boolean(props.artistId), props.artistId));
          dispatch(toggleLoadSpinner());
        }}
      >
        {!props.isLikedByUser ? <ThumbUp /> : <ThumbDown />}
        <span style={{ paddingLeft: '10px' }}>{!props.isLikedByUser ? ('Like this song') : ('Unlike this song')}</span>
      </Button>}
      <h3>Likes: {props.numLikes}</h3>
    </>
  );
}
import React from 'react';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { toggleLoadSpinner } from '../../../state/load/load.actions';
import { doLike } from '../../../state/audio/audio.action';

interface CardProps {
  userId: number;
  uploaderId: number;
  isLikedByUser: boolean;
  audioItemId: number;
  userApiToken: string;
  numLikes: number;
  artistId?: number;
}

const LikeItem: React.FC<CardProps> = (props: CardProps): React.ReactElement => {
  const dispatch = useDispatch();
  
  return (
    <>
      {props.userId !== props.uploaderId && <Button
        variant="contained"
        component="span"
        size="large"
        color="primary"
        className="likeButton"
        style={{ marginTop: '20px', marginBottom: '20px' }}
        onClick={() => {
          dispatch(doLike(props.audioItemId, props.userId, props.userApiToken, Boolean(props.artistId), props.artistId));
          dispatch(toggleLoadSpinner());
        }}
      >
        {!props.isLikedByUser ? <ThumbUp /> : <ThumbDown />}
        <span className="like-button-text" style={{ paddingLeft: '10px' }}>{!props.isLikedByUser ? ('Like this song') : ('Unlike this song')}</span>
      </Button>}
      <h3>Likes: {props.numLikes}</h3>
    </>
  );
};

export default LikeItem;
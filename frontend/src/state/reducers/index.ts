import { combineReducers } from 'redux';
import audioReducer from './audio.reducer';
import audioReducerTs from '../audio/audio.reducer';
import loadReducer from '../load/load.reducer';
import authReducer from '../auth/auth.reducer';
import artistReducer from '../artist/artist.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  loadReducer,
  audioReducerTs,
  artistReducer
});

export default rootReducer;
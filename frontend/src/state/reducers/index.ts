import { combineReducers } from 'redux';
import artistReducer from './artist.reducer';
import audioReducer from './audio.reducer';
import audioReducerTs from '../audio/audio.reducer';
import loadReducer from '../load/load.reducer';
import authReducerTs from '../auth/auth.reducer';

const rootReducer = combineReducers({
  authReducerTs,
  audioReducer,
  artistReducer,
  loadReducer,
  audioReducerTs
});

export default rootReducer;
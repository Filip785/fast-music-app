import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import artistReducer from './artist.reducer';
import audioReducer from './audio.reducer';
import audioReducerTs from '../audio/audio.reducer';
import loadReducer from '../load/load.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  artistReducer,
  loadReducer,
  audioReducerTs
});

export default rootReducer;
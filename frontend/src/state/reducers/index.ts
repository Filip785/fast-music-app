import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import artistReducer from './artist.reducer';
import audioReducer from './audio.reducer';
import loadReducer from './load.reducer';
import audioReducerTs from '../audio/audio.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  artistReducer,
  loadReducer,
  audioReducerTs
});

export default rootReducer;
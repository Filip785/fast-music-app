import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import artistReducer from './artist.reducer';
import audioReducer from './audio.reducer';
import loadReducer from './load.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  artistReducer,
  loadReducer
});

export default rootReducer;
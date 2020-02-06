import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import artistReducer from './artist.reducer';
import audioReducer from './audio.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  artistReducer
});

export default rootReducer;
import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import audioReducer from './audio.reducer';
import artistReducer from './artist.reducer';

const rootReducer = combineReducers({
  authReducer,
  audioReducer,
  artistReducer
});

export default rootReducer;
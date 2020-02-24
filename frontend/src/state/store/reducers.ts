import { combineReducers } from 'redux';
import audioReducerTs from '../audio/audio.reducer';
import loadReducer from '../load/load.reducer';
import authReducer from '../auth/auth.reducer';
import artistReducer from '../artist/artist.reducer';

const rootReducer = combineReducers({
  authReducer,
  loadReducer,
  audioReducerTs,
  artistReducer
});

export default rootReducer;
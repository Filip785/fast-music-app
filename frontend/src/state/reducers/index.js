import { combineReducers } from "redux";
import auth from './auth.reducer';
import audio from './audio.reducer';

const rootReducer = combineReducers({
  auth,
  audio
});

export default rootReducer;
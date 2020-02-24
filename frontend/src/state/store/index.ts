import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { verifyIsAllowedFileType } from '../audio/audio.middleware';

export default createStore(rootReducer, applyMiddleware(verifyIsAllowedFileType(), thunk));
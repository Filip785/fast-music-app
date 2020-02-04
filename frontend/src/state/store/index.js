import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import * as middlewares from '../middleware/index';

export default createStore(rootReducer, compose(applyMiddleware(middlewares.verifyIsAllowedFileType, thunk)));
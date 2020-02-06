import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import * as middlewares from '../middleware';

export default createStore(rootReducer, compose(applyMiddleware(middlewares.verifyIsAllowedFileType, thunk)));
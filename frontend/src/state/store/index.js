import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';

export default createStore(rootReducer, compose(applyMiddleware(thunk)));
import axios from 'axios';
import history from '../../helpers/history';
import {
  ATTEMPT_LOGIN,
  DO_LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  ATTEMPT_LOGIN_FAILURE,
  ATTEMPT_LOGIN_FAILURE_END
} from '../constants';
import { TOGGLE_LOADING_SPINNER } from '../load/load.constants';

export function attemptLogin(email, password) {
  return dispatch => {
    return axios.post('http://localhost/api/user/login', {
      email, password
    }).then(response => {
      dispatch({ type: ATTEMPT_LOGIN, payload: response.data });
      localStorage.setItem('authUser', JSON.stringify(response.data));
    }).catch(_ => {
      dispatch({ type: ATTEMPT_LOGIN_FAILURE });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    });
  };
}

export function attemptLoginFailureEnd() {
  return {
    type: ATTEMPT_LOGIN_FAILURE_END
  };
}

export function attemptRegister(name, username, email, password) {
  return dispatch => {
    return axios.post('http://localhost/api/user/create', {
      name, username, email, password
    }).then(_ => {
      dispatch({ type: REGISTER_SUCCESS });
      history.push('/login');
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      dispatch({ type: REGISTER_FAILURE, payload: error.response.data.errors });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    });
  };
}

export function doLogout() {
  localStorage.removeItem('authUser');

  return {
    type: DO_LOGOUT
  };
}
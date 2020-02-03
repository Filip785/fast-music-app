import { ATTEMPT_LOGIN, 
         DO_LOGOUT, 
         REGISTER_SUCCESS,
         REGISTER_FAILURE,
         ATTEMPT_LOGIN_FAILURE, 
         ATTEMPT_LOGIN_FAILURE_END 
} from "../constants/action-types";
import axios from 'axios';
import history from '../../helpers/history';

export function attemptLogin(email, password) {
  return dispatch => {
    return axios.post('http://localhost/api/user/login', {
      email, password
    }).then(response => {
      dispatch({ type: ATTEMPT_LOGIN, payload: response.data });
      localStorage.setItem('authUser', JSON.stringify(response.data));
      history.push('/dashboard');
    }).catch(_ => {
      dispatch({ type: ATTEMPT_LOGIN_FAILURE });
    });
  };
}

export function attemptLoginFailureEnd() {
  return { 
    type: ATTEMPT_LOGIN_FAILURE_END 
  };
}

export function attemptRegister(name, email, password) {
  return dispatch => {
    return axios.post('http://localhost/api/user/create', {
      name, email, password
    }).then(_ => {
      dispatch({ type: REGISTER_SUCCESS });
      history.push('/login');
    }).catch(error => {
      dispatch({ type: REGISTER_FAILURE, payload: error.response.data.errors });
      console.log("Error: ", error.response.data.errors);
    });
  };
}

export function doLogout() {
  localStorage.removeItem('authUser');
  
  return {
    type: DO_LOGOUT
  };
}
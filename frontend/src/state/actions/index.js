import { ATTEMPT_LOGIN, DO_LOGOUT } from "../constants/action-types";
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
    }).catch(error => {
      console.log("Error: ", error.response.data);

      // handle errors here
    });
  };
}

export function doLogout() {
  localStorage.removeItem('authUser');
  
  return {
    type: DO_LOGOUT
  };
}
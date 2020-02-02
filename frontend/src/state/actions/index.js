import { ATTEMPT_LOGIN } from "../constants/action-types";
import axios from 'axios';

export function attemptLogin(email, password) {
  return dispatch => {
    return axios.post('http://localhost/api/user/login', {
      email, password
    }).then(response => {
      dispatch({ type: ATTEMPT_LOGIN, payload: response.data });
    }).catch(error => {
      console.log("Error: ", error.response.data);  
    });
  };
}
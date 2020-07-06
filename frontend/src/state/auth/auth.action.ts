import { ATTEMPT_LOGIN, ATTEMPT_LOGIN_FAILURE, ATTEMPT_LOGIN_FAILURE_END, DO_LOGOUT, REGISTER_SUCCESS, REGISTER_FAILURE } from "./auth.constants";
import { ThunkAction } from "redux-thunk";
import { AuthState, AuthActionTypes } from "./auth.types";
import { Dispatch } from "redux";
import axios from "axios";
import { TOGGLE_LOADING_SPINNER } from "../load/load.constants";
import history from '../../helpers/history';

type ThunkResult<R = Promise<void>> = ThunkAction<R, AuthState, unknown, AuthActionTypes>;

export function attemptLogin(email: string, password: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/user/login`, { email, password });

      dispatch({ type: ATTEMPT_LOGIN, payload: response.data });
      localStorage.setItem('authUser', JSON.stringify(response.data));
    } catch (err) {
      dispatch({ type: ATTEMPT_LOGIN_FAILURE });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }
  };
}

export function attemptLoginFailureEnd(): AuthActionTypes {
  return {
    type: ATTEMPT_LOGIN_FAILURE_END
  };
}

export function attemptRegister(name: string, username: string, email: string, password: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}api/user/create`, { name, username, email, password });

      dispatch({ type: REGISTER_SUCCESS });
      history.push('/login');
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      dispatch({ type: REGISTER_FAILURE, payload: err.response.data.errors });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }
  };
}

export function doLogout(): AuthActionTypes {
  localStorage.removeItem('authUser');

  return {
    type: DO_LOGOUT
  };
}
import { ATTEMPT_LOGIN, DO_LOGOUT, REGISTER_SUCCESS, ATTEMPT_LOGIN_FAILURE, ATTEMPT_LOGIN_FAILURE_END, REGISTER_FAILURE } from "../constants/action-types";

const authUser = JSON.parse(localStorage.getItem('authUser'));

const initialState = {
  user: authUser ? { loggedIn: true, authUser } : {},
  registered: false,
  loginError: false,
  registerErrors: {}
};

function rootReducer(state = initialState, action) {
  if(action.type === ATTEMPT_LOGIN) {
    return { ...state, user: { loggedIn: true, authUser: action.payload } };
  }

  if(action.type === ATTEMPT_LOGIN_FAILURE) {
    return { ...state, loginError: true };
  }

  if(action.type === ATTEMPT_LOGIN_FAILURE_END) {
    return { ...state, loginError: false };
  }

  if(action.type === REGISTER_SUCCESS) {
    return { ...state, registered: true };
  }

  if(action.type === REGISTER_FAILURE) {
    console.log('payload->', action.payload);
    return { ...state, registerErrors: action.payload };
  }

  if(action.type === DO_LOGOUT) {
    return { ...state, user: {} };
  }

  return state;
}

export default rootReducer;
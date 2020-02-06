import { 
  ATTEMPT_LOGIN, 
  ATTEMPT_LOGIN_FAILURE, 
  ATTEMPT_LOGIN_FAILURE_END, 
  DO_LOGOUT,
  REGISTER_SUCCESS, 
  REGISTER_FAILURE 
} from '../constants';

const authUser = JSON.parse(localStorage.getItem('authUser'));

const initialState = {
  user: authUser ? { loggedIn: { fromAuth: false }, authUser } : { loggedIn: false },
  registered: false,
  loginError: false,
  registerErrors: {}
};

export default function auth(state = initialState, action) {
  if(action.type === ATTEMPT_LOGIN) {
    return { ...state, user: { loggedIn: { fromAuth: true }, authUser: action.payload } };
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
    return { ...state, registerErrors: action.payload };
  }

  if(action.type === DO_LOGOUT) {
    return { ...state, user: { loggedIn: false } };
  }

  return state;
}
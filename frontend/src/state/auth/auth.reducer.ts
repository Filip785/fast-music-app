import { AuthState, AuthActionTypes } from "./auth.types";
import { ATTEMPT_LOGIN, ATTEMPT_LOGIN_FAILURE, ATTEMPT_LOGIN_FAILURE_END, REGISTER_SUCCESS, REGISTER_FAILURE, DO_LOGOUT } from "./auth.constants";

const authUser = JSON.parse(localStorage.getItem('authUser')!);

const initialState: AuthState = {
  registered: false,
  loginError: false,
  user: authUser ? { loggedIn: { status: true, fromAuth: false }, authUser } : { loggedIn: { status: false, fromAuth: false } },
  registerErrors: {
    name: '',
    username: '',
    email: '',
    password: ''
  }
};

export default function authReducerTs(state = initialState, action: AuthActionTypes) {
  switch (action.type) {
    case ATTEMPT_LOGIN:
      return {
        ...state,
        user: {
          loggedIn: {
            status: true,
            fromAuth: true
          },
          authUser: action.payload
        }
      };
    case ATTEMPT_LOGIN_FAILURE:
      return {
        ...state,
        loginError: true
      };
    case ATTEMPT_LOGIN_FAILURE_END:
      return {
        ...state,
        loginError: false
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registered: true
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        registerErrors: action.payload
      };
    case DO_LOGOUT:
      return {
        ...state,
        user: { loggedIn: { status: false, fromAuth: false } }
      };
    default:
      return state;
  }
}
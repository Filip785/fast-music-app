import { ATTEMPT_LOGIN, DO_LOGOUT } from "../constants/action-types";

const authUser = JSON.parse(localStorage.getItem('authUser'));

const initialState = {
  user: authUser ? { loggedIn: true, authUser } : {}
};

function rootReducer(state = initialState, action) {
  if(action.type === ATTEMPT_LOGIN) {
    return { ...state, user: { loggedIn: true, authUser: action.payload } };
  }

  if(action.type === DO_LOGOUT) {
    return { ...state, user: {} };
  }

  return state;
}

export default rootReducer;
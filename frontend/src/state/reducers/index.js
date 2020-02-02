import { ATTEMPT_LOGIN } from "../constants/action-types";

const initialState = {
  user: {}
};

function rootReducer(state = initialState, action) {
  if(action.type === ATTEMPT_LOGIN) {
    return { ...state, user: action.payload };
  }

  return state;
}

export default rootReducer;
import { TOGGLE_LOADING_SPINNER } from "../constants";

const initialState = {
  isLoading: false
};

export default function load(state = initialState, action) {
  if(action.type === TOGGLE_LOADING_SPINNER) {
    return { ...state, isLoading: !state.isLoading };
  }

  return state;
}
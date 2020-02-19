import { LoadState, LoadActionTypes } from "./load.types";
import { TOGGLE_LOADING_SPINNER } from "./load.constants";

const initialState: LoadState = {
  isLoading: false
};

export default function load(state = initialState, action: LoadActionTypes) {
  switch(action.type) {
    case TOGGLE_LOADING_SPINNER:
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
}
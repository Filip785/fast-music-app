import { TOGGLE_LOADING_SPINNER } from "../constants";

export function toggleLoadSpinner() {
  return {
    type: TOGGLE_LOADING_SPINNER
  };
}
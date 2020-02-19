import { TOGGLE_LOADING_SPINNER } from "./load.constants";
import { LoadActionTypes } from "./load.types";

export function toggleLoadSpinner(): LoadActionTypes {
  return {
    type: TOGGLE_LOADING_SPINNER
  };
}
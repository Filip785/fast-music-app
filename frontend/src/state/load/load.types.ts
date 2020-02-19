import { TOGGLE_LOADING_SPINNER } from "./load.constants";

export interface ToggleLoadingSpinner {
  type: typeof TOGGLE_LOADING_SPINNER
}

export type LoadActionTypes = ToggleLoadingSpinner;

export type LoadState = {
  isLoading: boolean;
}
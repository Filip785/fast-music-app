import { DO_LOGOUT, TOGGLE_LOADING_SPINNER } from '../state/constants';

export default function performFrontendLogout(dispatch, history, hasSpinner) {
  localStorage.removeItem('authUser');
  dispatch({ type: DO_LOGOUT });
  history.push('/login');

  if(hasSpinner) {
    dispatch({ type: TOGGLE_LOADING_SPINNER });
  }
}
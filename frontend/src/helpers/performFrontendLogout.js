import { DO_LOGOUT } from '../state/constants';
import { TOGGLE_LOADING_SPINNER } from '../state/load/load.constants';

export default function performFrontendLogout(dispatch, history, hasSpinner) {
  localStorage.removeItem('authUser');
  dispatch({ type: DO_LOGOUT });
  history.push('/login');

  if(hasSpinner) {
    dispatch({ type: TOGGLE_LOADING_SPINNER });
  }
}
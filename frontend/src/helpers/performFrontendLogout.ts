import { TOGGLE_LOADING_SPINNER } from '../state/load/load.constants';
import { Dispatch, AnyAction } from 'redux';
import { History } from 'history';
import { DO_LOGOUT } from '../state/auth/auth.constants';

export default function performFrontendLogout(dispatch: Dispatch<AnyAction>, history: History<History.PoorMansUnknown>, hasSpinner: boolean) {
  localStorage.removeItem('authUser');
  dispatch({ type: DO_LOGOUT });
  history.push('/login');

  if(hasSpinner) {
    dispatch({ type: TOGGLE_LOADING_SPINNER });
  }
}
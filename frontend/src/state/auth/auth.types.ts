import { ATTEMPT_LOGIN, ATTEMPT_LOGIN_FAILURE, ATTEMPT_LOGIN_FAILURE_END, REGISTER_SUCCESS, REGISTER_FAILURE, DO_LOGOUT } from "./auth.constants";

export interface RegisterErrors {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  api_token: string;
}

export interface UserState {
  loggedIn: { status: boolean, fromAuth: boolean };
  authUser?: User;
}

export interface AttemptLoginAction {
  type: typeof ATTEMPT_LOGIN;
  payload: User;
}

export interface AttemptLoginFailureAction {
  type: typeof ATTEMPT_LOGIN_FAILURE;
}

export interface AttemptLoginFailureEndAction {
  type: typeof ATTEMPT_LOGIN_FAILURE_END;
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

export interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: RegisterErrors;
}

export interface DoLogoutAction {
  type: typeof DO_LOGOUT;
}

export type AuthActionTypes = AttemptLoginAction |
                              AttemptLoginFailureAction |
                              AttemptLoginFailureEndAction |
                              RegisterSuccessAction |
                              RegisterFailureAction |
                              DoLogoutAction;

export interface AuthState {
  user: UserState;
  registered: boolean;
  loginError: boolean;
  registerErrors: RegisterErrors
}
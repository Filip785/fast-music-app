import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { History, LocationDescriptor } from 'history';

interface LoggedInObject {
  status: boolean;
  fromAuth: boolean;
}

interface Props {
  component: React.ComponentType<any>;
  loggedIn: LoggedInObject;
  path: string[] | string;
  exact?: boolean;
}

const PublicRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { loggedIn } = rest;
  let to: string | History.LocationDescriptor<History.PoorMansUnknown> = '/dashboard';
  
  if(loggedIn.fromAuth) {
    to = {
      pathname: '/dashboard',
      state: { spinnerRunning: true }
    };
  }

  return (
    <Route {...rest} render={props => loggedIn.status ? (<Redirect to={to} />) : ( <Component {...props} /> )} />
  );
};

export default PublicRoute;
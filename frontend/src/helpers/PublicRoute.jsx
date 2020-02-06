import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = rest;
  let to = '/dashboard';

  if (loggedIn.fromAuth) {
    to = {
      pathname: '/dashboard',
      state: { spinnerRunning: true }
    };
  }

  return (
    <Route {...rest} render={props => loggedIn ? (<Redirect to={to} />) : ( <Component {...props} /> )} />
  );
};

export default PublicRoute;
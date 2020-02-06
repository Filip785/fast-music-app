import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => rest.loggedIn ? (<Redirect to={{pathname: '/dashboard', state: { withSpinner: true }}} />) : ( <Component {...props} /> )} />
);

export default PublicRoute;
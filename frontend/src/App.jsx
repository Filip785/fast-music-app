import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { Link, Router, Switch } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dashboard from './Dashboard';
import history from './helpers/history';
import PrivateRoute from './helpers/PrivateRoute';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import PublicRoute from './helpers/PublicRoute';
import { doLogout } from './state/actions/index';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

function mapStateToProps(state) {
  return { user: state.user };
}

class ConnectedApp extends React.Component {
  constructor(props) {
    super(props);

    this.doLogoutEv = this.doLogout.bind(this);
  }

  doLogout() {
    this.props.doLogout();

    history.push('/login');
  }

  render() {
    const { classes, user: { loggedIn } } = this.props;

    return (
      <Router history={history}>
        <div className="App">
          <AppBar>
            <Toolbar className={classes.container}>
              <div className="links">
                {!loggedIn && <Button color="inherit" component={Link} to="/login">Login</Button>}
                {!loggedIn && <Button color="inherit" component={Link} to="/register">Register</Button>}
                {loggedIn && <Button color="inherit" onClick={this.doLogoutEv}>Logout</Button>}
              </div>
            </Toolbar>
          </AppBar>

          <div className="content">
            <Switch>
              <PublicRoute loggedIn={loggedIn} component={Login} path={['/', '/login']} exact />
              <PublicRoute loggedIn={loggedIn} component={Register} path="/register" />

              <PrivateRoute loggedIn={loggedIn} component={Dashboard} path="/dashboard" />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const App = connect(mapStateToProps, { doLogout })(ConnectedApp);

export default withStyles(styles)(App);

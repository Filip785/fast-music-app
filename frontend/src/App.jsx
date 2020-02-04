import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { Link, Router, Switch } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dashboard from './components/Dashboard/Dashboard';
import history from './helpers/history';
import PrivateRoute from './helpers/PrivateRoute';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import PublicRoute from './helpers/PublicRoute';
import { doLogout } from './state/actions/index';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddAudioItem from './components/AddAudioItem/AddAudioItem';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = state => ({
  auth: state.authReducer
});

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
    const { classes } = this.props;
    const { user: { loggedIn, authUser } } = this.props.auth;

    return (
      <Router history={history}>
          <div className="App">
            <AppBar>
              <Toolbar className={classes.container} style={!loggedIn ? {justifyContent: 'flex-end'} : {}}>
                {loggedIn && <Typography variant="h6" className={classes.title} component={Link} to="/dashboard" color="inherit" style={{ textDecoration: 'none' }}>
                  Welcome, {authUser.name}
                </Typography>}
                <div className="links">
                  {!loggedIn && <Button color="inherit" component={Link} to="/login">Login</Button>}
                  {!loggedIn && <Button color="inherit" component={Link} to="/register">Register</Button>}
                  {loggedIn && <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    component={Link}
                    to="/add-audio-item"
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add new item
                  </Button>}
                  {loggedIn && <Button color="inherit" onClick={this.doLogoutEv}>Logout</Button>}
                </div>
              </Toolbar>
            </AppBar>

            <div className="content">
              <Switch>
                <PublicRoute loggedIn={loggedIn} component={Login} path={['/', '/login']} exact />
                <PublicRoute loggedIn={loggedIn} component={Register} path="/register" />
                
                <PrivateRoute loggedIn={loggedIn} component={Dashboard} path="/dashboard" />
                <PrivateRoute loggedIn={loggedIn} component={AddAudioItem} path="/add-audio-item" />
              </Switch>
            </div>
          </div>
      </Router>
    );
  }
}

const App = connect(mapStateToProps, { doLogout })(ConnectedApp);

export default withStyles(styles)(App);

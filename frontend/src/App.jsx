import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Link, Router, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './helpers/PrivateRoute';
import PublicRoute from './helpers/PublicRoute';
import history from './helpers/history';
import AddAudioItem from './components/AddAudioItem/AddAudioItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { 
  withStyles, 
  Typography, 
  Toolbar, 
  AppBar, 
  Button,
  CircularProgress
} from '@material-ui/core';
import { doLogout } from './state/actions';

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
  auth: state.authReducer,
  isLoading: state.loadReducer.isLoading
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
    const { classes, isLoading } = this.props;
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

          {isLoading && <div className="spinner">
            <CircularProgress className="mainProgress" size={300} color="secondary" />
          </div>}
      </Router>
    );
  }
}

const App = connect(mapStateToProps, { 
  doLogout 
}) (ConnectedApp);

export default withStyles(styles)(App);

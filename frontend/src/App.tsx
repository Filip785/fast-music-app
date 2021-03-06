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
import AddEditAudioItem from './components/AddEditAudioItem/AddEditAudioItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
  Typography, 
  Toolbar, 
  AppBar, 
  Button,
  CircularProgress
} from '@material-ui/core';
import { doLogout } from './state/auth/auth.action';
import Profile from './components/User/Profile';
import { AuthState, AuthActionTypes } from './state/auth/auth.types';

interface Props {
  isLoading: boolean;
  auth: AuthState;
  doLogout: () => AuthActionTypes;
}

interface State {

}

const mapStateToProps = (state: any) => ({
  auth: state.authReducer,
  isLoading: state.loadReducer.isLoading
});

class ConnectedApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  doLogout() {
    this.props.doLogout();

    history.push('/login');
  }

  render() {
    const { isLoading } = this.props;
    const { user: { loggedIn, authUser } } = this.props.auth;
    
    return (
      <Router history={history}>
          <div className="App">
            <AppBar>
              <Toolbar style={!loggedIn.status ? {justifyContent: 'flex-end', display:'flex'} : {display:'flex', justifyContent: 'space-between'}}>
                {loggedIn.status && <Typography variant="h6" component={Link} to="/dashboard" color="inherit" style={{ textDecoration: 'none' }}>
                  Welcome, {authUser!.name}
                </Typography>}
                <div className="links">
                  {!loggedIn.status && <Button color="inherit" component={Link} to="/login">Login</Button>}
                  {!loggedIn.status && <Button color="inherit" component={Link} to="/register">Register</Button>}
                  {loggedIn.status && <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    component={Link}
                    to="/add-audio-item"
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add new item
                  </Button>}
                  {loggedIn.status && <Button color="inherit" onClick={this.doLogout}>Logout</Button>}
                </div>
              </Toolbar>
            </AppBar>

            <div className="content">
              <Switch>
                <PublicRoute loggedIn={loggedIn} component={Login} path={['/', '/login']} exact />
                <PublicRoute loggedIn={loggedIn} component={Register} path="/register" />
                
                <PrivateRoute loggedIn={loggedIn} component={Dashboard} path="/dashboard" />
                <PrivateRoute loggedIn={loggedIn} key="add-audio-item" component={AddEditAudioItem} additionalProps={{type: 'add'}} path="/add-audio-item" />
                <PrivateRoute loggedIn={loggedIn} key="edit-audio-item" component={AddEditAudioItem} additionalProps={{type: 'edit'}} path="/edit-audio-item/:id" />

                <PrivateRoute loggedIn={loggedIn} component={Profile} path="/profile/:id" />
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

export default App;

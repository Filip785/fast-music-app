import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { Link, BrowserRouter, Switch, Route } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
    justifyContent: 'space-between'
  }
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className="App">
        <AppBar>
          <Toolbar className={classes.container}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <div className="links">
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className="content">
          <Switch>
            <Route path={["/", '/login']} exact>
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

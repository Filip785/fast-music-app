import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { Link, BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
            <li>
              <Link to={"/register"}>Register</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, Link, hashHistory } from 'react-router';

import App from './components/App.js';
import Landingpage from './components/Landingpage.js';
import Dashboard from './components/Dashboard.js';
import Selfreflection from './components/Selfreflection.js';
import Settings from './components/Settings.js';
import AuthService from './utils/AuthService.js';

const app = document.getElementById('app');

const auth = new AuthService('V3oJOmHRIeW7nJnLZIa7ioWOo8godJVQ', 'focuspro.auth0.com');

// validate authentication for private routes
const requireAuth = (nextState, replace)=>{
  if (!auth.loggedIn()){
    replace({ pathname: '/' });
  }
};

render(
  <Router history={hashHistory}>
    <Route path="/" component = {App} auth={auth}>
    <IndexRoute component={Landingpage}></IndexRoute>
    <Route path="access_token=:token" component={Dashboard}/>
    <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>
    <Route path="selfreflection" component={Selfreflection} onEnter={requireAuth}/>
    <Route path="settings" component={Settings} onEnter={requireAuth}/>
    </Route>
  </Router>
  , app
);
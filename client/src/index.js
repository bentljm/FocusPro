import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, Link, hashHistory } from 'react-router';

import App from './components/App.js';
import Landingpage from './components/Landingpage.js';
import Dashboard from './components/Dashboard.js';
import Selfreflection from './components/Selfreflection.js';
import Settings from './components/Settings.js';

const app = document.getElementById('app');

render(
  <Router history={hashHistory}>
    <Route path="/" component = {App}>
    <IndexRoute component={Landingpage}></IndexRoute>
    <Route path="dashboard" component={Dashboard}/>
    <Route path="selfreflection" component={Selfreflection}/>
    <Route path="settings" component={Settings}/>
    </Route>
  </Router>
  , app
);
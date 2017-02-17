import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, Link, hashHistory } from 'react-router';

import App from './components/App.js';

const app = document.getElementById('app');

render(
  <Router history={hashHistory}>
    <Route path="/" component = {App}>
    </Route>
  </Router>
  , app
);
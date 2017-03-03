import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactGA from 'react-ga';
import App from './components/App';
import Landingpage from './components/Landingpage';
import Dashboard from './components/Dashboard';
import Selfreflection from './components/Selfreflection';
import Settings from './components/Settings';
import AuthService from './utils/AuthService';


const app = document.getElementById('app');

const auth = new AuthService('V3oJOmHRIeW7nJnLZIa7ioWOo8godJVQ', 'focuspro.auth0.com');

// validate authentication for private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/' });
  }
};

// initialize ReactGA to view page popularity
ReactGA.initialize('UA-000333-23', { 
  debug: true,
  title: 'PAGEVIEWS'
});

// Keep track of our log page views
function logPageView() {
  ReactGA.set({ page: window.location.hash });
  if (!auth.loggedIn()) {
    ReactGA.pageview('/'); // home page
  } else {
    ReactGA.pageView(window.location.hash);
  }
}


render(
  <Router history={hashHistory} onUpdate={logPageView}>
    <Route path="/" component={App} auth={auth}>
      <IndexRoute component={Landingpage} />
      <Route path="access_token=:token" component={Dashboard} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
      <Route path="selfreflection" component={Selfreflection} onEnter={requireAuth} />
      <Route path="settings" component={Settings} onEnter={requireAuth} />
    </Route>
  </Router>
  , app,
);

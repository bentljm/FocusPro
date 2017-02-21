import React from 'react'
import { Router, Route } from 'react-router'
import App from './App.js'
import LandingPage from './LandingPage.js';
import Motivational from './Motivational.js';
import SelfReflection from './Selfreflection.js';

const clientRoutes = (
  <Route path="/api/users" component={App}/>
  <Route path="/api/users/:username" component={App}/>
  <Route path="/api/users/:username/setting" component={App}/>
  <Route path="/api/users/:username/setting/blacklist" component={App}/>
  <Route path="/api/users/:username/extension_data" component={App}/>
  <Route path="/api/users/:username/goals/:goal_id/reflections" component={App}/>
  <Route path="/api/users/:username/goals/:goal_id/reflections/:reflection_id" component={App}/>
  <Route path="/api/users/:username/goals" component={App}/>
  <Route path="/api/users/:username/goals/:goal_id" component={App}/>
  <Route path="api/users/:username/goals/:goal_id/subgoals" component={App}/>
);

export default class AppRoutes extends React.Component {
  render() {
	return (
      <Router history={browserHistory} routes={clientRoutes} 
      onUpdate={() => window.scrollTo(0, 0)}/>    
	)
  }
}
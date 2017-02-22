import React from 'react'
import { Router, Route } from 'react-router'
import App from './App.js'
import LandingPage from './LandingPage.js';
import Motivational from './Motivational.js';
import SelfReflection from './SelfReflection.js';

function getAllGoals () {
	var context = this;
	$.ajax({
		type: 'GET',
		
	})
}

const clientRoutes = (
  <Route path="/api/users" component={LandingPage}/>

  <Route path="/api/users/:username" component={Dashboard}/>

  <Route path="/api/users/:username/setting" component={Settings}/>
  <Route path="/api/users/:username/setting/blacklist" component={Settings}/>

  <Route path="/api/users/:username/extension_data" component={App}/>
  
  <Route path="/api/users/:username/goals" component={App}/>
  <Route path="/api/users/:username/goals/:goal_id" component={Goal}/>
  <Route path="api/users/:username/goals/:goal_id/subgoals" component={Subgoal}/>


  <Route path="/api/users/:username/goals/:goal_id/reflections" component={SelfReflection}/>
  <Route path="/api/users/:username/goals/:goal_id/reflections/:reflection_id" component={SelfReflection}/>

  <Route path="*" component={Layout}
);

export default class AppRoutes extends React.Component {
  render() {
	return (
      <Router history={browserHistory} routes={clientRoutes} 
      onUpdate={() => window.scrollTo(0, 0)}/>    
	)
  }
}



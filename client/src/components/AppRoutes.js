import React from 'react'
import { Router, Route } from 'react-router'
import App from './App.js'
import LandingPage from './LandingPage.js';
import Motivational from './Motivational.js';
import SelfReflection from './Selfreflection.js';



export default class AppRoutes extends React.Component {
  render() {
	return (
      <Router history={browserHistory} routes={clientRoutes} 
      onUpdate={() => window.scrollTo(0, 0)}/>    
	)
  }
}
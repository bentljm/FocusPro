import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';
import { browserHistory } from 'react-router';

export default class AuthService {
  constructor(clientId, domain) {
    // Configure Auth0
    var HOST_URL = process.env.NODE_ENV === 'production'? 'http://focuspro.herokuapp.com/#/':'http://localhost:7777/#/';
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: HOST_URL,
        responseType: 'token'
      }
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.event = new EventEmitter();
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    this.lock.getUserInfo(authResult.accessToken,(error, profile)=>{
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
      }
    });
    // navigate to the dashboard route
    browserHistory.replace({pathname: '/#/dashboard'});
  }

  setProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile));
    this.event.emit('profile_updated', profile);
  }

  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : {};
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    browserHistory.replace('/');
  }
}
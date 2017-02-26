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
    var createSettings = function(profile) {
          //Get the userId
          var userId = 0;
          $.ajax({
            type: 'GET',
            url: 'api/users/' + profile.user_id,
            success: function (data) {
              console.log("SUCCESS: GOT USERID", data.data[0].id);
              userId = data.data[0].id;
            },
            error: function (err) {
              console.log('ERROR: COULD NOT GET USERID', err);
            }
          });

          //findOrCreate settings for user
          $.ajax({
            type: 'GET',
            url: '/api/users/' + profile.user_id + '/setting',
            contentType: 'application/json',
            data: JSON.stringify({picture: profile.picture, quote: '"The way to get started is to quit talking and begin doing." - Walt Disney', reflection_freq: 0, reminder: false, reminder_type: '', reminder_freq: 0, reminder_address: '', UserId: userId}),
            success: function(data) {console.log("SUCCESS: POSTED SETTING: ", data);},
            error: function(err) {console.log("ERROR: COULD NOT POST SETTING", err);}
          });
        };

    // Saves the user token
    this.setToken(authResult.idToken);
    this.lock.getUserInfo(authResult.accessToken,(error, profile)=>{
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
        //Save user in db
        $.ajax({
          type: 'GET', // findOrCreate
          url: '/api/users', // Endpoint
          contentType: 'application/json',
          data: JSON.stringify({username: profile.given_name, auth0_id: profile.user_id, daily_goal: '', email: profile.email}),
          success: function (data) {
            console.log("SUCCESS: POSTED USER: " + JSON.stringify(data));
            createSettings(profile);
          },
          error: function(err) {console.log("ERROR: COULD NOT POST USER   ");}
        });
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
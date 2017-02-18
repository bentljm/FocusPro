import React, { Component } from 'react';
import Landingpage from './Landingpage.js';
import {Sidebar} from './Sidebar.js';
import Auth from './Auth.js';

export default class App extends React.Component {

  constructor (props) {
    super(props);
  }

  componentWillMount () {
      this.lock = new Auth0Lock('V3oJOmHRIeW7nJnLZIa7ioWOo8godJVQ', 'focuspro.auth0.com');
      // Set the state with a property that has the token
      this.setState({idToken: this.getIdToken()})
  }

  createLock () {
    this.lock = new Auth0Lock(this.props.clientId, this.props.domain);
  }

  getIdToken () {
    // First, check if there is already a JWT in local storage
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // If there is no JWT in local storage and there is one in the URL hash,
    // save it in local storage
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // Handle any error conditions
        console.log("Error signing in", authHash);
      }
    }
    return idToken;
  }

  render() {
    return (
      <div>
        <Sidebar />
        <main>
          <div className="container">
            <Auth lock={this.lock} />
            {this.props.children}
          </div>
        </main>
      </div>
    );
  }
}




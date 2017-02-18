import React from 'react';

export default class Auth extends React.Component {

  constructor(props) {
    super(props);
  }

  showLock () {
    // Show the Auth0Lock widget
    this.props.lock.show();
  }

  render () {
    return (
    <div className="login-box">
      <a onClick={this.showLock.bind(this)}>Sign In</a>
    </div>);
  }
}
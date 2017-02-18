import React, { Component } from 'react';
import Landingpage from './Landingpage.js';

export default class App extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
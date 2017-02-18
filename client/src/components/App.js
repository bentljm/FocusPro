import React, { Component } from 'react';
import Landingpage from './Landingpage.js';
import {Sidebar} from './Sidebar.js';

export default class App extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Sidebar />
        <main>
          <div className="container">
            {this.props.children}
          </div>
        </main>
      </div>
    );
  }
}
import React from 'react';
import {} from 'react-materialize';
import Goal from './Goal.js';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <h1> Welcome, USER </h1>
        <Goal />
      </div>
    );
  }
}
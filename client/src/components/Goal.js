import React from 'react';
import {} from 'react-materialize';
import Subgoal from './Subgoal.js';

export default class Goal extends React.Component {
  render() {
    return (
      <div>
        <h3> Goal </h3>
        <Subgoal />
      </div>
    );
  }
}
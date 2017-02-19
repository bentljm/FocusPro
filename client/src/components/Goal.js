import React from 'react';
import {} from 'react-materialize';
import Subgoal from './Subgoal.js';

//Todo: Replace with better slider
export default class Goal extends React.Component {
  render() {
    return (
      <div className="collapsible-body">
      <span>
      <form action="#">
        <p className="range-field">
          <input type="range" id="slider" min="0" max="100"/>
        </p>
      </form>
      <Subgoal />
      </span>
      </div>
    );
  }
}
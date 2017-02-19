import React from 'react';
import {} from 'react-materialize';
import Question from './Question.js';

//Todo: Create a question component
export default class Selfreflection extends React.Component {
  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/17/17</span><span className="questionDate">|</span>
              <span>Did you spend adequate time towards your goal today?</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/18/17</span><span className="questionDate">|</span><span>Question</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/19/17</span><span className="questionDate">|</span><span>Question</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
        </ul>
      </div>
    );
  }
}
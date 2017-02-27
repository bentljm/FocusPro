import React from 'react';
import {Input, Button, Icon} from 'react-materialize';
import Subgoal from './Subgoal.js';

//Todo: Replace with better slider
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
    this.getSubgoals = this.getSubgoals.bind(this);
  }

  componentDidMount() {
    this.getSubgoals();
    this.callCustomJQuery();
  }

   callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  getSubgoals() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/goals/'+this.props.goal+'/subgoals',
      success: function(data) {
        console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + JSON.stringify(data.data));
        that.setState({subgoals: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET SUBGOALS   ");}
    });
  }

  handleChange(event) {
    this.setState({subgoal: event.target.value});
  }

  postSubgoal() {
    var that = this;
    $.ajax({
      type: 'POST',
      url: '/api/goals/' + this.props.goal + '/subgoals',
      contentType: 'application/json',
      data: JSON.stringify({subgoal: this.state.subgoal, status: false, GoalId: this.props.goal}),
      success: function(data) {
        console.log("SUCCESS: POSTED INDIVIDUAL GOAL: ", data);
        that.getSubgoals();
      },
      error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL GOAL", err);}
    });
  }

  render() {
    return (
      <div className="collapsible-body">
      Progress:
      <form action="#">
        <p className="range-field">
          <input type="range" id="slider" min="0" max="100"/>
        </p>
      </form>
      Subgoals: <br />
      {this.state.subgoals.map((subgoal, index) => (
        <Subgoal key = {'sub' + index} subgoal = {subgoal} status = {subgoal.status} id = {subgoal.id} user_id = {this.props.user_id} goal = {subgoal.GoalId} updateSubgoals = {this.getSubgoals}/>
        ))}
      <Input s={8} label="New Subgoal" onChange={this.handleChange} /> <Button className="subgoalButton" waves='light' onClick={this.postSubgoal}>Set Subgoal</Button>
      </div>
    );
  }
}
import React from 'react';
import {Input, Button} from 'react-materialize';
import Subgoal from './Subgoal.js';

//Todo: Replace with better slider
//Todo: Fix so that subgoals will show before adding a new subgoal
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
  }

  componentdidMount(){
    this.getSubgoals();
  }
  getSubgoals() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+this.props.user_id+'/goals/'+this.props.goal+'/subgoals',
      success: function(data) {
        console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + JSON.stringify(data.data));
        that.setState({subgoals: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET SUBGOALS   ")}
    });
  }

  handleChange(event) {
    this.setState({subgoal: event.target.value});
  }

  postSubgoal() {
    $.ajax({
      type: 'POST',
      url: '/api/users/'+this.props.user_id+'/goals/'+this.props.goal+'/subgoals',
      contentType: 'application/json',
      data: JSON.stringify({subgoal: this.state.subgoal, status: false, GoalId: this.props.goal, UserId: this.props.userId}),
      success: function(data) {console.log("SUCCESS: POSTED INDIVIDUAL GOAL: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL GOAL", err);}
    });
    this.getSubgoals();
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
        <Subgoal key = {'sub' + index} subgoal = {subgoal} status = {subgoal.status} id = {subgoal.id} user_id = {this.props.user_id} goal = {subgoal.GoalId}/>
        ))}
      <Input s={8} label="New Subgoal" onChange={this.handleChange} /> <Button className="subgoalButton" waves='light' onClick={this.postSubgoal}>Set Subgoal</Button>
      </div>
    );
  }
}
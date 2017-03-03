import React from 'react';
import { Input, Button } from 'react-materialize';
//import Nouislider from 'react-nouislider';
const Line = require('rc-progress').Line;
import Subgoal from './Subgoal';

// Todo: Replace with better slider
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: '',
      percent: 0,
      color: '#ff0000'
    };
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
    this.getSubgoals = this.getSubgoals.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.increaseProgress = this.increaseProgress.bind(this);
    this.decreaseProgress = this.decreaseProgress.bind(this);
  }

  componentWillMount() {
    this.getSubgoals();
  }

  componentDidMount() {
    this.getSubgoals();
    this.callCustomJQuery();
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  getSubgoals() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/goals/${this.props.goal}/subgoals`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED ALL SUBGOALS:', JSON.stringify(data.data));
        that.setState({ subgoals: data.data });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SUBGOALS', err); },
    });
  }

  increaseProgress() {
    const newStep = Math.round((1/this.state.subgoals.length)*100);
    const percent = this.state.percent + newStep;
    if(percent >= 99) {
      this.setState({ percent: 100, color: '#00ff00'});
    } else {
      this.setState({ percent: percent });
      if (percent > 0 && percent <= 16) {this.setState({ color: '#ff0000' });}
      if (percent > 16 && percent <= 32) {this.setState({ color: '#ff3f00' });}
      if (percent > 32 && percent <= 48) {this.setState({ color: '#ff7d00' });}
      if (percent > 48 && percent <= 64) {this.setState({ color: '#ffbe00' });} 
      if (percent > 64 && percent <= 80) {this.setState({ color: '#ffe700' });} 
      if (percent > 80 && percent <= 96) {this.setState({ color: '#ffff00' });} 
      if (percent > 96 && percent <= 100) {this.setState({ color: '#c0ff00' });}  
    }
  }

  decreaseProgress() {
    const newStep = Math.round((1/this.state.subgoals.length)*100);
    const percent = this.state.percent - newStep;
    if(percent <= 1) {
      this.setState({ percent: 0 });
    } else {
      this.setState({ percent: percent });
      if (percent > 0 && percent <= 16) {this.setState({ color: '#ff0000' });}
      if (percent > 16 && percent <= 32) {this.setState({ color: '#ff3f00' });}
      if (percent > 32 && percent <= 48) {this.setState({ color: '#ff7d00' });}
      if (percent > 48 && percent <= 64) {this.setState({ color: '#ffbe00' });} 
      if (percent > 64 && percent <= 80) {this.setState({ color: '#ffe700' });} 
      if (percent > 80 && percent <= 96) {this.setState({ color: '#ffff00' });} 
      if (percent > 96 && percent <= 100) {this.setState({ color: '#c0ff00' });}  
    }
  }

  handleChange(event) {
    this.setState({ subgoal: event.target.value });
  }

  postSubgoal() {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `/api/goals/${this.props.goal}/subgoals`,
      contentType: 'application/json',
      data: JSON.stringify({ subgoal: this.state.subgoal, status: false, GoalId: this.props.goal }),
      success: (data) => {
        console.log('SUCCESS: POSTED INDIVIDUAL GOAL: ', data);
        that.getSubgoals();
        that.cleanInput();
        that.alertConfirmation();
      },
      error: (err) => { console.log('ERROR: COULD NOT POST INDIVIDUAL GOAL', err); },
    });
  }

  alertConfirmation() {
    Materialize.toast('Subgoal set!', 1000);
  }

  cleanInput() {
    this.setState({ subgoal: '' });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.postSubgoal();
    }
  }

  render() {
    const containerStyle = {
      width: '98%',
    };
    return (
      <div className="collapsible-body">Progress: {this.state.percent}%
      <br />
      <div style={containerStyle}>
        <Line percent={this.state.percent} strokeWidth="3" strokeColor={this.state.color} />
      </div>
      <br />
      Subgoals:
      <br />
      {this.state.subgoals.length === 0 && <div> There is no subgoal set currently. </div>}
      {this.state.subgoals.map(subgoal =>
        <Subgoal increase={this.increaseProgress} decrease={this.decreaseProgress} key={`sub ${subgoal.id}`} subgoal={subgoal} status={subgoal.status} id={subgoal.id} user_id={this.props.user_id} goal={subgoal.GoalId} updateSubgoals={this.getSubgoals} />
        )}
      <Input s={8} label="New Subgoal" onChange={this.handleChange} value={this.state.subgoal} onKeyPress={this.handleKeyPress} />
      <Button className="subgoalButton" waves="light" onClick={this.postSubgoal}>Set Subgoal</Button>
      </div>
    );
  }
}





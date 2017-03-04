import React from 'react';
import { Input } from 'react-materialize';
import Subgoal from './Subgoal';

const Line = require('rc-progress').Line;

// Todo: Replace with better slider
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: '',
      subgoalVisited: false,
      subgoalEnabled: false,
      percent: 0,
      color: '#ff0000'
    };
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
    this.getSubgoals = this.getSubgoals.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.increaseProgress = this.increaseProgress.bind(this);
    this.decreaseProgress = this.decreaseProgress.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setPercentage = this.setPercentage.bind(this);
    // this.validate = this.validate.bind(this);
    // this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillMount() {
    this.getSubgoals();
  }

  componentDidMount() {
    this.getSubgoals();
    this.callCustomJQuery();
  }

  getSubgoals() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/goals/${this.props.goal}/subgoals`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED ALL SUBGOALS:', JSON.stringify(data.data));
        that.setState({ subgoals: data.data });
        that.checkStatus();
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SUBGOALS', err); },
    });
  }

  setPercentage(percentage) {
    if (percentage >= 98) {
      this.setState({ percent: 100, color: '#00ff00' });
    } else if (percentage <= 2) {
      this.setState({ percent: 0, color: '#ff0000' });
    } else {
      this.setState({ percent: percentage });
      this.setColor(percentage);
    }
  }

  setColor(percentage) {
    if (percentage > 0 && percentage <= 16) { this.setState({ color: '#ff0000' }); }
    if (percentage > 16 && percentage <= 32) { this.setState({ color: '#ff3f00' }); }
    if (percentage > 32 && percentage <= 48) { this.setState({ color: '#ff7d00' }); }
    if (percentage > 48 && percentage <= 64) { this.setState({ color: '#ffbe00' }); }
    if (percentage > 64 && percentage <= 80) { this.setState({ color: '#ffe700' }); }
    if (percentage > 80 && percentage <= 96) { this.setState({ color: '#ffff00' }); }
    if (percentage > 96 && percentage <= 98) { this.setState({ color: '#c0ff00' }); }
    if (percentage > 98 && percentage <= 100) { this.setState({ color: '#00ff00' }); }
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  checkStatus() {
    let i = 0;
    let percentage = 0;
    const newStep = Math.round((1 / this.state.subgoals.length) * 100);
    for (i; i < this.state.subgoals.length; i++) {
      if (this.state.subgoals[i].status) {
        percentage += newStep;
      }
    }
    this.setPercentage(percentage);
    this.setColor(percentage);
  }

  increaseProgress() {
    const newStep = Math.round((1 / this.state.subgoals.length) * 100);
    const percentage = this.state.percent + newStep;
    this.setPercentage(percentage);
  }

  decreaseProgress() {
    const newStep = Math.round((1 / this.state.subgoals.length) * 100);
    const percentage = this.state.percent - newStep;
    this.setPercentage(percentage);
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
    if (this.state.subgoalEnabled && this.state.subgoal !== '') {
      if (e.key === 'Enter') {
        this.postSubgoal();
      }
    }
  }

  validate(subgoal) {
    return {
      subgoal: subgoal.length === 0,
    };
  }

  // handleBlur() {
  //   this.setState({ subgoalVisited: true });
  // }

  render() {
    const containerStyle = {
      width: '98%',
    };
    const { subgoal } = this.state;
    if (subgoal) {
      this.state.subgoalEnabled = subgoal.length > 0;
    }
    const errors = this.validate(this.state.subgoal);
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
        {this.state.subgoals.map(subgoals =>
          <Subgoal increase={this.increaseProgress} decrease={this.decreaseProgress} key={`sub ${subgoals.id}`} subgoal={subgoals} status={subgoals.status} id={subgoals.id} user_id={this.props.user_id} goal={subgoals.GoalId} updateSubgoals={this.getSubgoals} />
          )}
        <div>
          <Input s={12} className={errors.subgoal && this.state.subgoalVisited ? 'red' : 'white'} label="Set new subgoal" data-length="255" onChange={this.handleChange} value={this.state.subgoal} onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} />
        </div>
        <br /><br /><br />
      </div>
    );
  }
}

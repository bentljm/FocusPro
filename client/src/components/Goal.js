import React from 'react';
import { Input, Button } from 'react-materialize';
import Subgoal from './Subgoal';

// Todo: Replace with better slider
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
    this.getSubgoals = this.getSubgoals.bind(this);
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
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SUBGOALS', err); },
    });
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
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
      },
      error: (err) => { console.log('ERROR: COULD NOT POST INDIVIDUAL GOAL', err); },
    });
  }

  render() {
    return (
      <div className="collapsible-body">
      Progress:
      <form action="#">
        <p className="range-field">
          <input type="range" id="slider" min="0" max="100" />
        </p>
      </form>
      Subgoals:
      <br />
        {this.state.subgoals.length === 0 && <div> There is no subgoals set currently. </div>}
        {this.state.subgoals.map(subgoal =>
          <Subgoal key={`sub ${subgoal.id}`} subgoal={subgoal} status={subgoal.status} id={subgoal.id} user_id={this.props.user_id} goal={subgoal.GoalId} updateSubgoals={this.getSubgoals} />
          )}
        <Input s={8} label="New Subgoal" onChange={this.handleChange} />
        <Button className="subgoalButton" waves="light" onClick={this.postSubgoal}>Set Subgoal</Button>
      </div>
    );
  }
}

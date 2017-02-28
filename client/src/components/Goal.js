import React from 'react';
import { Input, Button } from 'react-materialize';
import Subgoal from './Subgoal';
import Nouislider from 'react-nouislider';

// Todo: Replace with better slider
export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subgoals: [],
      subgoal: '',
      step: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.postSubgoal = this.postSubgoal.bind(this);
    this.getSubgoals = this.getSubgoals.bind(this);
    this.getStep = this.getStep.bind(this);
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
        that.getStep();
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SUBGOALS', err); },
    });
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  handleChange(event) {
    this.setState({ subgoal: event.target.value});
    this.getStep();
  }

  getStep() {
    if(this.state.subgoals.length > 0) {
      var step = Math.round(100/this.state.subgoals.length);
      this.setState({step: step});
    } else {
      this.setState({step: 1});
    }
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

  render() {
    return (
      <div className="collapsible-body">Progress:
      <br /><br /><br />
      <Nouislider
        range={{min: 0, max: 100}}
        start={[0]}
        step={this.state.step}
        behaviour={'tap'}
        format={{
          from: function(value) {
            return parseInt(value) + "%";
          },
          to: function(value) {
            return parseInt(value) + "%";
          }
        }}
        tooltips
      />
      <br />
      Subgoals:
      <br />
        {this.state.subgoals.length === 0 && <div> There is no subgoal set currently. </div>}
        {this.state.subgoals.map(subgoal =>
          <Subgoal key={`sub ${subgoal.id}`} subgoal={subgoal} status={subgoal.status} id={subgoal.id} user_id={this.props.user_id} goal={subgoal.GoalId} updateSubgoals={this.getSubgoals} />
          )}
        <Input s={8} label="New Subgoal" onChange={this.handleChange} value={this.state.subgoal}/>
        <Button className="subgoalButton" waves="light" onClick={this.postSubgoal}>Set Subgoal</Button>
      </div>
    );
  }
}

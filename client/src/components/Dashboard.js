import React from 'react';
import {Row, Input, Col, Button} from 'react-materialize';
import Goal from './Goal.js';
import Site from './Site.js';
import Stat from './Stat.js';
import Motivational from './Motivational.js';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      goals: [],
      goalInput: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postGoal = this.postGoal.bind(this);
  }

  componentDidMount(){
    this.getAllGoals();
  }

  getAllGoals () {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+this.state.profile.user_id+'/goals/',
      success: function(data) {
        console.log("SUCCESS: OBTAINED ALL GOALS:", data);
        that.setState({goals: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET ALL GOALS", err);}
    });
  }

  handleInputChange(event) {
    this.setState({goalInput: event.target.value});
  }

  postGoal(newGoal) {
    $.ajax({
      type: 'POST',
      url: '/api/users/'+this.state.profile.user_id+'/goals',
      contentType: 'application/json',
      data: JSON.stringify({goal: this.state.goalInput, progress: 0, goal_picture: ''}),
      success: function(data) {console.log("SUCCESS: POSTED INDIVIDUAL GOAL: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL GOAL", err);}
    });
    this.getAllGoals();
  }

  render() {
    console.log(Array.isArray(this.state.goals));
    return (
      <div>
        <h1> Welcome, USER </h1>
        "The way to get started is to quit talking and begin doing." - Walt Disney
        <br />
        <br />
        <h3> Goal of the Day: </h3>
        <Row>
          <Input s={12} />
        </Row>
        <h3> Main Goals: </h3>
          <ul className="collapsible" data-collapsible="expandable">
          {this.state.goals.map((goal, index) => (
            <li key = {index}>
            <div className="collapsible-header">Goal</div>
            <Goal key = {'goal' + index} goal = {goal}/>
          </li>
            ))}
        </ul>
        <Row>
        <Input s={8} label="New Goal" value={this.state.value} onChange={this.handleInputChange} /> <Button className="goalButton" waves='light' onClick={this.postGoal}>Set Goal</Button> <Motivational />
        </Row>
        <br />
        <h3> Sites: </h3>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header">Site 1</div>
            <div className="collapsible-body"><span><Site /></span></div>
          </li>
          <li>
            <div className="collapsible-header">Site 2</div>
            <div className="collapsible-body"><span><Site /></span></div>
          </li>
          <li>
            <div className="collapsible-header">Site 3</div>
            <div className="collapsible-body"><span><Site /></span></div>
          </li>
        </ul>
        <br />
        <br />
        <h3> Stats: </h3>
        <Row>
          <Col s={4}>
          <Stat />
          Today's Stats
          </Col>
          <Col s={4}>
          <Stat />
          Week's Stats
          </Col>
          <Col s={4}>
          <Stat />
          All Time Stats
          </Col>
        </Row>
      </div>
    );
  }
}
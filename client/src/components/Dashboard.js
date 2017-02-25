import React from 'react';
import {Row, Input, Col, Button, Icon} from 'react-materialize';
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
      goalInput: '',
      dayGoalInput: '',
      userId: '',
      setting: {},
      blacklist: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postGoal = this.postGoal.bind(this);
    this.handleDayGoalChange = this.handleDayGoalChange.bind(this);
    this.handleDayGoalSubmission = this.handleDayGoalSubmission.bind(this);
    this.removeGoal = this.removeGoal.bind(this);
  }

  componentWillMount() {
    this.getUserId();
    this.getSetting();
  }

  componentDidMount(){
    this.getAllGoals();
    this.getBlacklist();
  }

  getUserId() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: 'api/users/' + this.state.profile.user_id,
      success: function (data) {
        console.log("SUCCESS: GOT USER INFO", data.data[0]);
        that.setState({userId: data.data[0].id});
        that.setState({dayGoalInput: data.data[0].daily_goal || ''});
      },
      error: function (err) {
        console.log('ERROR: COULD NOT GET USERID', err);
      }
    });
  }

  getSetting() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/' + this.state.profile.user_id + '/setting',
      success: function(data) {
        console.log("SUCCESS: OBTAINED SETTINGS: ", data);
        that.setState({setting: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET SETTINGS", err);}
    });
  }

  getBlacklist() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/' + this.state.profile.user_id + '/setting/blacklist',
      success: function(data) {
        console.log("SUCCESS: OBTAINED BLACKLIST: ", data.data);
        that.setState({blacklist: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET BLACKLIST", err);}
    });
  }

  getAllGoals () {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/' + this.state.profile.user_id + '/goals/',
      success: function(data) {
        console.log("SUCCESS: OBTAINED ALL GOALS:", data);
        that.setState({goals: data.data});
      },
      error: function(err) {
        console.log("ERROR: COULD NOT GET ALL GOALS", err);
      }
    });
  }

  handleInputChange(event) {
    this.setState({goalInput: event.target.value});
  }

  handleDayGoalChange(event) {
    this.setState({dayGoalInput: event.target.value});
  }

  handleDayGoalSubmission() {
    $.ajax({
      type: 'PUT',
      url: '/api/users/' + this.state.profile.user_id,
      contentType: 'application/json',
      data: JSON.stringify({daily_goal: this.state.dayGoalInput}),
      success: function(data) {console.log("Update daily goal to", data);},
      error: function(err) {console.log("Error updating daily goal", err);}
    });
  }

  postGoal() {
    var that = this;
    $.ajax({
      type: 'POST',
      url: '/api/users/' + this.state.profile.user_id + '/goals',
      contentType: 'application/json',
      data: JSON.stringify({goal: this.state.goalInput, progress: 0, goal_picture: '', UserId: this.state.userId}),
      success: function(data) {
        console.log("SUCCESS: POSTED INDIVIDUAL GOAL: ", data);
        that.setState({goalInput: ''}); //Not clearing input...
        that.getAllGoals();
      },
      error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL GOAL", err);}
    });

  }

  removeGoal (goal_id) {
    var that = this;
    $.ajax({
      type: 'DELETE',
      url: '/api/users/' + this.state.profile.user_id + '/goals/' + goal_id,
      success: function(data) {
        console.log("Remove goal:", data);
        that.getAllGoals();
      },
      error: function(err) {
        console.log("ERROR: COULD NOT GET ALL GOALS", err);
      }
    });
  }

  render() {
    return (
      <div>
        <h1> Welcome, {this.state.profile.given_name} </h1>
        {this.state.setting.quote}
        <br />
        <br />
        <h3> Goal of the Day: </h3>
        <Row>
          <Input s={10} value={this.state.dayGoalInput} onChange={this.handleDayGoalChange} /> <Button className="dayGoalButton" waves='light' onClick={this.handleDayGoalSubmission}>Save</Button>
        </Row>
        <h3> Main Goals: </h3>
          <ul className="collapsible" data-collapsible="expandable">
          {this.state.goals.map((goal, index) => (
            <li key = {index}>
            <div className="collapsible-header">{goal.goal} <a href = '#/dashboard' onClick = {()=>this.removeGoal(goal.id)}><Icon right>delete</Icon></a></div>
            <Goal key = {'goal' + index} goal = {goal.id} user_id = {this.state.profile.user_id} />
          </li>
            ))}
        </ul>
        <Row>
        <Input s={8} label="New Goal" value={this.state.value} onChange={this.handleInputChange} /> <Button className="goalButton" waves='light' onClick={this.postGoal}>Set Goal</Button> <Motivational />
        </Row>
        <br />
        <h3> Sites: </h3>
        <ul className="collapsible" data-collapsible="expandable">
          {this.state.blacklist.map((site, index) => (
            <li key = {'sites ' + index}>
              <div className="collapsible-header">{site.url}</div>
              <div className="collapsible-body"><Site url = {site.url} siteId = {site.id}/></div>
            </li>
            ))}
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
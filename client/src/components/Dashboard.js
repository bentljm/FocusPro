import React from 'react';
import { Row, Input, Col, Button, Icon } from 'react-materialize';
import Goal from './Goal';
import Site from './Site';
import Stat from './Stat';
import Motivational from './Motivational';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: true,
      profile: this.props.auth.getProfile(),
      goals: [],
      goalInput: '',
      dayGoalInput: '',
      userId: '',
      setting: {},
      blacklist: [],
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
    this.callCustomJQuery();
  }

  componentDidMount() {
    this.props.auth.event.on('userId_updated', () => {
      this.setState({
        profile: this.props.auth.getProfile(),
      });
      this.getUserId();
      this.getAllGoals();
      this.getBlacklist();
      this.getSetting();
    });
    this.getAllGoals();
    this.getBlacklist();
    this.callCustomJQuery();
  }

  getUserId() {
    const that = this;
    $.ajax({
      type: 'GET',
      url: `api/users/${this.state.profile.user_id}`,
      success: (data) => {
        console.log('SUCCESS: GOT USER INFO', data.data[0]);
        that.setState({ userId: data.data[0].id });
        that.setState({ dayGoalInput: data.data[0].daily_goal || '' });
      },
      error: (err) => {
        console.log('ERROR: COULD NOT GET USERID', err);
      },
    });
  }

  getSetting() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/setting`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED SETTINGS: ', data.data[0]);
        that.setState({ setting: data.data[0] });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SETTINGS', err); },
    });
  }

  getBlacklist() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/blacklist`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED BLACKLIST: ', data.data);
        that.setState({ blacklist: data.data });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET BLACKLIST', err); },
    });
  }

  getAllGoals() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/goals/`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED ALL GOALS:', data);
        that.setState({ goals: data.data });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET ALL GOALS', err); },
    });
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  handleInputChange(event) {
    this.setState({ goalInput: event.target.value });
  }

  handleDayGoalChange(event) {
    this.setState({ dayGoalInput: event.target.value });
  }

  handleDayGoalSubmission() {
    $.ajax({
      type: 'PUT',
      url: `/api/users/${this.state.profile.user_id}`,
      contentType: 'application/json',
      data: JSON.stringify({ daily_goal: this.state.dayGoalInput }),
      success: (data) => { console.log('Update daily goal to', data); },
      error: (err) => { console.log('Error updating daily goal', err); },
    });
  }

  postGoal() {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `/api/users/${this.state.profile.user_id}/goals`,
      contentType: 'application/json',
      data: JSON.stringify({ goal: this.state.goalInput, progress: 0, goal_picture: '', UserId: this.state.userId }),
      success: (data) => {
        console.log('SUCCESS: POSTED INDIVIDUAL GOAL: ', data);
        that.setState({ goalInput: '' }); // Not clearing input...
        that.getAllGoals();
        that.alertConfirmation();
      },
      error: (err) => { console.log('ERROR: COULD NOT POST INDIVIDUAL GOAL', err); },
    });
  }

  removeGoal(goal_id) {
    const that = this;
    console.log('goal_id', goal_id);
    $.ajax({
      type: 'DELETE',
      url: `/api/goals/${goal_id}`,
      success: (data) => {
        console.log('Remove goal:', data);
        that.getAllGoals();
      },
      error: (err) => { console.log('ERROR: COULD NOT REMOVE THE GOAL', err); },
    });
  }

  alertConfirmation() {
    Materialize.toast('Goal added!', 1000);
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
          <Input s={10} value={this.state.dayGoalInput} onChange={this.handleDayGoalChange} /> <Button className="dayGoalButton" waves="light" onClick={this.handleDayGoalSubmission}>Save</Button>
        </Row>
        <h3> Main Goals: </h3>
        {(this.state.goals.length === 0 || !this.state.profile.user_id) && <div>You have no goals set currently.</div>}
        {(this.state.goals.length > 0 && this.state.profile.user_id) && <ul className="collapsible" data-collapsible="expandable">
          {this.state.goals.map(goal =>
            <li key={goal.id}>
              <div className="collapsible-header">{goal.goal}
                <a href="#/dashboard" onClick={() => this.removeGoal(goal.id)}>
                  <Icon right>delete</Icon>
                </a>
              </div>
              <Goal goal={goal.id} user_id={this.state.profile.user_id} />
            </li>
            )}
        </ul>}
        <Row>
          <Input s={8} label="New Goal" value={this.state.value} onChange={this.handleInputChange} />
          <Button className="goalButton" waves="light" onClick={this.postGoal}>Set Goal</Button>
          <Motivational />
        </Row>
        <br />
        <h3> Sites: </h3>
        <ul className="collapsible" data-collapsible="expandable">
          {this.state.blacklist.map(site =>
            <li key={`sites ${site.id}`}>
              <div className="collapsible-header">{site.url}</div>
              <div className="collapsible-body"><Site url={site.url} siteId={site.id} /></div>
            </li>
            )}
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

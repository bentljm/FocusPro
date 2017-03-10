import React from 'react';
import { Row, Input, Col } from 'react-materialize';
import Goal from './Goal';
import Site from './Site';
import Stat from './Stat';
import Motivational from './Motivational';

export default class Dashboard2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: true,
      profile: this.props.auth.getProfile(),
      username: '',
      goals: [],
      goalInput: '',
      dayGoalInput: '',
      userId: '',
      setting: {},
      blacklist: [],
      extension: [],
      dayGoalEnabled: false,
      goalEnabled: false,
      dayGoalVisited: false,
      goalVisited: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.postGoal = this.postGoal.bind(this);
    this.handleDayGoalSubmission = this.handleDayGoalSubmission.bind(this);
    this.removeGoal = this.removeGoal.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleQuoteKeyPress = this.handleQuoteKeyPress.bind(this);
    this.validate = this.validate.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getExtensionSite = this.getExtensionSite.bind(this);
  }

  componentWillMount() {
    this.getUserId();
    this.getSetting();
    this.getExtensionData();
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
    this.getExtensionData();
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
        that.setState({ username: data.data[0].username || this.state.profile.nickname });
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
        // Do not show blackout sites
        const filtered = data.data.filter(e => e.blacklist_type !== '1');
        that.setState({ blacklist: filtered });
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

  getExtensionData() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/extension_data`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED EXTENSION DATA: ', data.data);
        that.setState({ extension: data.data });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET EXTENSION DATA', err); },
    });
  }

  getExtensionSite(site) {
    let siteInfo = {};
    for (let i = 0; i < this.state.extension.length; i++) {
      if (this.state.extension[i].url.includes(site)) {
        siteInfo = this.state.extension[i];
      }
    }
    console.log('siteInfo', siteInfo);
    return siteInfo;
  }
  handleChange(event, str) {
    this.setState({ [str]: event.target.value });
  }

  handleKeyPress(e) {
    if (this.state.goalEnabled && this.state.goalInput !== '') {
      if (e.key === 'Enter') {
        this.postGoal();
      }
    }
  }

  handleQuoteKeyPress(e) {
    if (this.state.dayGoalEnabled && this.state.dayGoalInput !== '') {
      if (e.key === 'Enter') {
        this.handleDayGoalSubmission();
      }
    }
  }

  handleDayGoalSubmission() {
    const that = this;
    $.ajax({
      type: 'PUT',
      url: `/api/users/${this.state.profile.user_id}`,
      contentType: 'application/json',
      data: JSON.stringify({ daily_goal: this.state.dayGoalInput }),
      success: (data) => {
        console.log('Update daily goal to', data);
        that.alertGoalAdded('Goal of the Day');
      },
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
        that.getAllGoals();
        that.cleanInput();
        that.alertGoalAdded('Goal');
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

  alertGoalAdded(str) {
    Materialize.toast(`${str} added!`, 1000);
  }

  cleanInput() {
    this.setState({ goalInput: '' });
  }

  validate(dayGoal, goal) {
    return {
      dayGoal: dayGoal.length === 0,
      goal: goal.length === 0,
    };
  }

  handleBlur(field) {
    if (field === 'dayGoal') {
      this.setState({ dayGoalVisited: true });
    } else {
      this.setState({ goalVisited: true });
    }
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  render() {
    const { dayGoalInput } = this.state;
    if (dayGoalInput) {
      this.state.dayGoalEnabled = dayGoalInput.length > 0;
    }
    const { goalInput } = this.state;
    if (goalInput) {
      this.state.goalEnabled = goalInput.length > 0;
    }
    const errors = this.validate(this.state.dayGoalInput, this.state.goalInput);
    return (
      <div>
        <Row>
          <Col s={12}>
            <div className="titleHead z-depth-4">
              <h2 className="topName">
              Hello, {this.state.username}! <a href="#/settings"><i className="material-icons tiny edit">edit</i></a>
              </h2>
              {this.state.setting.quote ? this.state.setting.quote : "In order to succeed, we must first believe that we can."} <a href="#/settings"><i className="material-icons tiny edit">edit</i></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col s={9}>
            <div className="gotd z-depth-4">
              <h3 className="titleText"> Goal of the Day </h3>
              <Input s={11} className={errors.dayGoal && this.state.dayGoalVisited ? 'error' : 'white'} data-length="255" placeholder="Add new goal of the day" value={this.state.dayGoalInput} onChange={e => this.handleChange(e, 'dayGoalInput')} onKeyPress={this.handleQuoteKeyPress} onBlur={() => this.handleBlur('dayGoal')} />
              <a href="#/dashboard" onClick={this.handleDayGoalSubmission}><i className="material-icons small return">add_box</i></a>
            </div>
          </Col>
          <Col s={3}>
            <div className="dashboardBox z-depth-4">
              <h3 className="titleText">Blacklist <a href="#/settings"><i className="material-icons small return">add_box</i></a></h3>
              <ul className="collapsible" data-collapsible="expandable">
                {this.state.blacklist.map(site =>
                  <Site site={site} url={site.url} siteId={site.id} siteInfo={this.getExtensionSite} />
                )}
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col s={9}>
            <div className="dashboardBox z-depth-4">
              <h3 className="titleText">Goals <Motivational /></h3>
              {(this.state.goals.length === 0 || !this.state.profile.user_id) && <div className="setGoal">You have no goals set currently. Set one now.</div>}
              {(this.state.goals.length > 0 && this.state.profile.user_id) && <ul className="collapsible" data-collapsible="expandable">
                {this.state.goals.map(goal =>
                  <Goal key={goal.id} goal={goal} user_id={this.state.profile.user_id} removeGoal={this.removeGoal} />
                )}
              </ul>}
              <Input s={11} className={errors.goal && this.state.goalVisited ? 'error' : 'white'} data-length="255" label="Set new goal" value={this.state.goalInput} onChange={e => this.handleChange(e, 'goalInput')} onKeyPress={this.handleKeyPress} onBlur={() => this.handleBlur('goal')} />
              <a href="#/dashboard" onClick={this.postGoal}><i className="material-icons small return">add_box</i></a>
            </div>
          </Col>
          <Col s={3}>
            <div className="statsBox z-depth-4">
              <h3 className="titleText">Time Stats</h3>
              <Stat profile={this.state.profile} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

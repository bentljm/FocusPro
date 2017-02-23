import React from 'react';
import {} from 'react-materialize';

export default class Selfreflection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      reflections: [],
      userId: '',
      reflection: {},
      goals:[]
    }
  }

  componentdidMount(){
    this.getAllGoals();
    this.state.goals.map((goal) => {
      this.getReflections(goal.id);
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

  getReflections(goalId) {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+this.props.user_id + '/goals/' + goalId + '/reflections',
      success: function(data) {
        console.log("SUCCESS: OBTAINED REFLECTIONS: ", data);
        that.setState({reflections: data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET REFLECTIONS", err)}
    });
  }

  getSingleReflection(goalId, reflId) {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+this.props.user_id + '/goals/' + goalId + '/reflections/' + reflId,
      success: function(data) {
        console.log("SUCCESS: OBTAINED SINGLE REFLECTION: ", data);
        that.setState({reflection: data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET REFLECTIONS", err)}
    });
  }

  postReflections(goalId) {
    $.ajax({
      type: 'POST',
      url: '/api/users/'+this.props.user_id + '/goals/' + goalId + '/reflections',
      contentType: 'application/json',
      data: JSON.stringify({answer: '', GoalId: goalId, UserId: this.state.userId}),
      success: function(data) {console.log("SUCCESS: POSTED BLACKLIST: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST BLACKLIST", err);}
    });
  }

  getUserId() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: 'api/users/' + this.state.profile.user_id,
      success: function (data) {
        console.log("SUCCESS: GOT USERID", data.data[0].id);
        that.setState({userId: data.data[0].id});
      },
      error: function (err) {
        console.log('ERROR: COULD NOT GET USERID', err);
      }
    });
  }

  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/17/17</span><span className="questionDate">|</span>
              <span>Did you spend adequate time towards your goal today?</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/18/17</span><span className="questionDate">|</span><span>Question</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">
              <span className="questionDate">02/19/17</span><span className="questionDate">|</span><span>Question</span>
            </div>
            <div className="collapsible-body"><span>Answer here.</span></div>
          </li>
        </ul>
      </div>
    );
  }
}
import React from 'react';
import {} from 'react-materialize';

export default class Selfreflection extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      reflections: [],
      answer: '',
    };
    this.getAllReflections = this.getReflections.bind(this);
    this.getAllGoals = this.getAllGoals.bind(this);
    this.postReflections = this.postReflections.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.getReflections();
    //this.postReflections(JSON.stringify("what did you do today"));
    this.callCustomJQuery();
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  getAllGoals() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: '/api/users/' + this.props.user_id + '/goals',
      success: function(data) {
        console.log("OBTAINED ALL GOALS")
      },
      error: function(err) {console.error("ERROR: COULD NOT GET GOALS")}
    })
  }

  getReflections() { //  Get question here
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+ this.props.user_id + '/reflections',
      success: function(data) {
        console.log("SUCCESS: OBTAINED REFLECTIONS: ", data.data);
        that.setState({question: data.data.question});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET REFLECTIONS", err)}
    });
  }
  
  postReflections() {
    $.ajax({
      type: 'POST',
      url: '/api/users/'+ this.props.user_id + '/reflections',
      contentType: 'application/json',
      data: JSON.stringify({answer: this.state.answer, question: question, reflId: this.props.id}),
      success: function(data) {console.log("SUCCESS: POSTED REFLECTIONS: ", data.data);},
      error: function(err) {console.log("ERROR: COULD NOT POST REFLECTION", err);}
    });
  }

  handleChange(event) {
    this.setState({answer: event.target.value})
  }

  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            {this.state.reflections.map((reflection, index) => (
              <div className="collapsible-header">
                <span className="questionDate">02/17/17</span><span className="questionDate">|</span>
                <span>Did you spend adequate time towards your goal today?</span>
              </div>
              <div className="collapsible-body">
                <span>Answer here.</span>

                <Reflection key = {index} reflection = {reflection} answer = {reflection.answer}
                question = {reflection.question} id = {reflection.id} user_id={this.props.user_id} />
               
              <input s={8} label="New Answer" onChange={this.handleChange}/>
              <button className="submitAnswer" onClick={this.postReflections}>Self Reflection</button>
            </div>
             ))}
          </li>
        </ul>
      </div>
    );
  }
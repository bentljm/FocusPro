import React from 'react';
import { Row, Input, Col, Button, Icon } from 'react-materialize';

export default class Selfreflection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(), // it gets imported here
      reflections: [],
      answer: '',
      question: '',
    };
    this.getReflections = this.getReflections.bind(this);
    this.postReflections = this.postReflections.bind(this);
    this.handleCAnswerhange = this.handleAnswerChange.bind(this);
  }

  componentDidMount(){
    this.getReflections();
    //this.postReflections(JSON.stringify("what did you do today"));
    this.callCustomJQuery();
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  getReflections() { //  Get question here
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/'+ this.state.profile.user_id + '/reflections',
      success: function(data) {
        console.log(data.data)
        console.log("USER ID: ", that.state.profile.user_id)
        console.log("SUCCESS: OBTAINED REFLECTIONS: ", data);
        that.setState({reflections: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET REFLECTIONS", err)}
    });
  }


  
  postReflections() {
    $.ajax({
      type: 'POST',
      url: '/api/users/'+ this.state.profile.user_id + '/reflections',
      contentType: 'application/json',
      data: JSON.stringify({answer: this.state.answer, question: this.state.question, auth0_id: this.state.profile.user_id}),
      success: function(data) {console.log("SUCCESS: POSTED REFLECTIONS: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST REFLECTION", err);}
    });
  }
  

  handleAnswerChange(event) {
    this.setState({answer: event.target.value})
  }

  // format this to Date

  render() {
    return ( 
      <div>
        <h1> Self-Reflection </h1>
        {this.state.reflections.map((reflection) => (
        <ul className="collapsible" data-collapsible="expandable">
          <li>
              <div className="collapsible-header">
                <span className="questionDate">{reflection.createdAt}</span><span className="questionDate"></span>
                <span>{reflection.question}</span>
              </div>
              <div className="collapsible-body">
                <span>{reflection.answer}</span>  
              </div>     
          </li>
        </ul>
        ))}
         <Row>
            <Input s={10} label="New Answer" onChange={this.handleAnswerChange}/>
            <Button className="submitAnswer" onClick={this.postReflections}>Self Reflection</Button>
          </Row>  
      </div>
     
    );
  }
}
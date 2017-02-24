import React from 'react';
import {Row, Input} from 'react-materialize';

//TODO: Update completion status upon clicking
export default class Subgoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    var that = this;
    this.setState({status: !this.state.status})
    $.ajax({
      type: 'PUT',
      url: '/api/users/' + this.props.user_id + '/goals/' + this.props.goal + '/subgoals/' + this.props.id,
      contentType: 'application/json',
      data: JSON.stringify({status: that.state.status}),
      success: function(data) {console.log("SUCCESS: UPDATED SUBGOAL: ", data);},
      error: function(err) {
        console.log("ERROR: COULD NOT PUT INDIVIDUAL SUBGOAL", err);
      }
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Input name='group1' type='checkbox' value='check' checked = {this.state.status} label={this.props.subgoal.subgoal} onClick = {this.handleClick}/>
        </Row>
      </div>
    );
  }
}
import React from 'react';
import { Row, Input, Icon } from 'react-materialize';

export default class Subgoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
    };
    this.handleClick = this.handleClick.bind(this);
    this.removeSubgoal = this.removeSubgoal.bind(this);
  }

  handleClick() {
    const that = this;
    this.setState({ status: !this.state.status });
    $.ajax({
      type: 'PUT',
      url: `/api/subgoals/${this.props.id}`,
      contentType: 'application/json',
      data: JSON.stringify({ status: that.state.status }),
      success: (data) => { console.log('SUCCESS: UPDATED SUBGOAL: ', data); },
      error: (err) => { console.log('ERROR: COULD NOT PUT INDIVIDUAL SUBGOAL', err); },
    });
  }

  removeSubgoal() {
    const that = this;
    $.ajax({
      type: 'DELETE',
      url: `/api/subgoals/${this.props.id}`,
      success: (data) => {
        console.log('Remove subgoal:', data);
        that.props.updateSubgoals();
      },
      error: (err) => { console.log('ERROR: COULD NOT GET ALL GOALS', err); },
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Input name="group1" type="checkbox" value="check" checked={this.state.status} label={this.props.subgoal.subgoal} onClick={this.handleClick} />
          <a href="#/dashboard" onClick={this.removeSubgoal}>
            <Icon right>delete</Icon>
          </a>
        </Row>
      </div>
    );
  }
}

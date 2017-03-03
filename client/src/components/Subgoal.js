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

  getSubgoal() {
    $.ajax({
      type: 'GET',
      url: `/api/subgoals/${this.props.id}`,
      contentType: 'application/json',
      success: (data) => {
        console.log('SUCCESS: GET SINGLE SUBGOAL: ', data);
        this.setState({ status: data.data.status });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SINGLE SUBGOAL', err); },
    });
  }

  handleClick() {
    const that = this;
    if(!that.state.status) {
      that.props.increase();
    } else {
      that.props.decrease();
    }
    $.ajax({
      type: 'PUT',
      url: `/api/subgoals/${this.props.id}`,
      contentType: 'application/json',
      data: JSON.stringify({ status: !that.state.status }),
      success: (data) => {
        console.log('SUCCESS: UPDATED SUBGOAL: ', data);
        that.getSubgoal();
      },
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

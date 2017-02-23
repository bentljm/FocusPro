import React from 'react';
import {Row, Input} from 'react-materialize';

//TODO: Update completion status upon clicking
export default class Subgoal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.subgoal);
    return (
      <div>
        <Row>
          <Input name='group1' type='checkbox' value='check' label={this.props.subgoal.subgoal} />
        </Row>
      </div>
    );
  }
}
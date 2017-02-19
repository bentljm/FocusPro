import React from 'react';
import {Row, Input} from 'react-materialize';

export default class Subgoal extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Input name='group1' type='checkbox' value='check' label='Subgoal' />
        </Row>
      </div>
    );
  }
}
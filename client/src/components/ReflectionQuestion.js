import React from 'react';
import { Row, Input, Button, Table } from 'react-materialize';

export default class ReflectionQuestion extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <h1>Awareness Questions</h1>
        <h5>How much time have you been spending on the blacklist sites?</h5>
        <Table>
          <thead>
            <tr>
              <th data-field="sites">Blacklist sites</th>
              <th data-field="guessedTime">Time you think you spent</th>
              <th data-field="actualTime">Actual time spent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>www.facebook.com</td>
              <td><Input type="select">
                <option value="0"></option>
                <option value="1">0~30min</option>
                <option value="2">30min~1hr</option>
                <option value="3">1hr~2hr</option>
                <option value="4">2hr+</option>
              </Input></td>
              <td>126 min</td>
            </tr>
          </tbody>
        </Table>
        <Button>Answer Awareness Questions</Button>
        <br />
        <br />
        <Row>
          <h1>Reflection Questions</h1>
          <h5>Not bad, you are aware of how much time you lost on the distraction sites! Please think about:</h5>
        </Row>
        <Row>
          <div>What is already working in your system that you can build on?</div>
          <Input s={12}></Input>
        </Row>
        <Row>
          <div>What might help look like?</div>
          <Input s={12}></Input>
        </Row>
      </div>
    );
  }
}
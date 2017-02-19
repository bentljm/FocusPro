import React from 'react';
import {Table} from 'react-materialize';

//Todo: Create a question component
export default class Selfreflection extends React.Component {
  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>
        <Table className="responsive highlight">
          <thead>
            <tr>
              <th data-field="id">Date</th>
              <th data-field="question">Question</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2/18/17</td>
              <td>Question Goes Here</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
import React from 'react';
import {Table, Input, Row, Col} from 'react-materialize';


export default class Settings extends React.Component {
  render() {
    return (
      <div>
        <h1> Settings </h1>
        <h3> Blacklist: </h3>
        <Table>
          <thead>
            <tr>
              <th data-field="id">Site</th>
              <th data-field="type">Type</th>
              <th data-field="limit">Time Limit</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>www.facebook.com</td>
              <td>Blackout</td>
              <td>N/A</td>
            </tr>
          </tbody>

        </Table>
        <br />
        <Row>
          <Input s={6} label="Add Site" />
          <Input s={3} type='select' label="Type" defaultValue='1'>
            <option value='1'>Blackout</option>
            <option value='2'>Block after exceeding</option>
            <option value='3'>Warn after exceeding</option>
          </Input>
          <Input s={3} label="Time Limit (min)" />
        </Row>
        <h3> Personalization: </h3>
        <Row>
        <Input s={12} label="Image" />
        </Row>
        <Row>
        <Input s={12} label="Quote" />
        </Row>
        <Row>
        <Input s={2} type='select' label="Reminder Type" defaultValue='1'>
          <option value='1'>No Reminder</option>
          <option value='2'>Text</option>
          <option value='3'>Email</option>
        </Input>
        <Input s={8} label="Number/Email Address" />
        <Input s={2} type='select' label="Frequency" defaultValue='1'>
          <option value='1'>Daily</option>
          <option value='2'>Weekly</option>
        </Input>
        </Row>
      </div>
    );
  }
}
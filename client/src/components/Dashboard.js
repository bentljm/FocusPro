import React from 'react';
import {Row, Input, Col, Button} from 'react-materialize';
import Goal from './Goal.js';
//Todo: Create a site component
export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <h1> Welcome, USER </h1>
        "The way to get started is to quit talking and begin doing." - Walt Disney
        <br />
        <br />
        <h3> Goal of the Day: </h3>
        <Row>
          <Input s={12} />
        </Row>
        <h3> Main Goals: </h3>
          <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header">Goal</div>
            <Goal />
          </li>
          <li>
            <div className="collapsible-header">Second</div>
            <div className="collapsible-body"><span>Map for every goal.</span></div>
          </li>
          <li>
            <div className="collapsible-header">Third</div>
            <div className="collapsible-body"><span>Map for every goal.</span></div>
          </li>
        </ul>
        <Row>
        <Input s={8} label="New Goal"/> <Button className="goalButton" waves='light' onClick={()=>console.log('set goal')}>Set Goal</Button> <Button className="goalButton" waves='light'>Inspire Me</Button>
        </Row>
        <br />
        <h3> Sites: </h3>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header">Site 1</div>
            <div className="collapsible-body"><span>Line chart here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">Site 2</div>
            <div className="collapsible-body"><span>Line chart here.</span></div>
          </li>
          <li>
            <div className="collapsible-header">Site 3</div>
            <div className="collapsible-body"><span>Line chart here.</span></div>
          </li>
        </ul>
        <br />
        <br />
        <h3> Stats: </h3>
        <Row>
          <Col s={4}>
          Today's Stats
          </Col>
          <Col s={4}>
          Week's Stats
          </Col>
          <Col s={4}>
          All Time Stats
          </Col>
        </Row>
      </div>
    );
  }
}
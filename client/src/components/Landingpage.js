import React from 'react';
import {Row, Col} from 'react-materialize';

//Todo: Make everything smaller
//Todo: When using actual images, set max-height and max-width based on % so it scales

export default class Landingpage extends React.Component {
  render() {
    return (
      <div className="row">
      <h1> FocusPro </h1>
      <h3> Welcome to FocusPro.</h3>
      <h5> We help you limit distractions and stay on task. </h5>
      <br /> <br />
      <Row>
        <Col s={7}>
          <img className="placeholder" />
        </Col>
        <Col s={5}>
          <br /> <br /><br /> <br /> <br />
          <h5>Set goals and subgoals</h5>
        </Col>
      </Row>
      <br /> <br />
      <Row>
         <Col s={7}>
          <br /> <br /><br /> <br /> <br />
          <h5>Alerts you when you are off task</h5>
        </Col>
        <Col s={5}>
          <img className="placeholder" />
        </Col>
      </Row>
      <br /> <br />
      <Row>
        <Col s={7}>
          <img className="placeholder" />
        </Col>
        <Col s={5}>
          <br /> <br /><br /> <br /> <br />
          <h5>Intelligently keeps track of overall data patterns</h5>
        </Col>
      </Row>
      <br /> <br />
      <Row>
         <Col s={7}>
          <br /> <br /><br /> <br /> <br />
          <h5>Companion Google Chrome Extension</h5>
          <h7> Download here </h7>
        </Col>
        <Col s={5}>
          <img className="placeholder" />
        </Col>
      </Row>
      </div>
    );
  }
}
import React from 'react';
import {Row, Col, Card} from 'react-materialize';

//Todo: When using actual images, set max-height and max-width based on % so it scales

export default class Landingpage extends React.Component {
  render() {
    return (
      <div className="row">
      <h1 className="center"> FocusPro </h1>
      <h3 className="center"> Welcome to FocusPro.</h3>
      <h5 className="center"> We help you limit distractions and stay on task. </h5>
      <br /> <br />
      <Row>
        <Col s={7}>
          <img className="placeholder" />
        </Col>
        <Col s={5}>
          <br /> <br /><br /> <br /> <br />
          Set goals and subgoals and track your progress. Blacklist sites to limit distractions by blocking or warning you when you have exceeded the time limit you have set.
        </Col>
      </Row>
      <br /> <br />
      <Row>
         <Col s={7}>
          <br /> <br /><br /> <br /> <br />
          Alerts you when you are off task through window notifications using our Chrome extension. Shows prompts to ask you to self-reflect on your progress for the day and how much you have worked towards your goal.
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
          Intelligently keeps track of overall data patterns. See how your habits change as you slowly wean yourself off unproductive sites.
        </Col>
      </Row>
      <br /> <br />
      <Row>
         <Col s={7}>
          <br /> <br /><br /> <br /> <br />
          <h5>Companion Google Chrome Extension</h5>
          Use our Chrome extension to track your tab usage and to send you alert messages and self-reflection questions. Download here.
        </Col>
        <Col s={5}>
          <img className="placeholder" />
        </Col>
      </Row>
      <br />
      <div className="center">
        <a className="waves-effect waves-light btn-large">Get Started</a>
      </div>
      <br />
      <h5 className="center"> Meet the Team </h5>
      <Row>
      <Col>
        <Card key={'card0'} className='white' title='Jeff Bentler' actions={[<a href='https://github.com/bentljm'>GitHub</a>]}>
        <img src="../../assets/jeff_img.jpeg" className="circle" />
        </Card>
      </Col>
      <Col>
        <Card key={'card1'} className='white' title='Josephine Chen' actions={[<a href='https://github.com/Josephine-Chen'>GitHub</a>]}>
        <img src="../../assets/josephine_img.jpeg" className="circle" />
        </Card>
      </Col>
      <Col>
        <Card key={'card2'} className='white' title='Ian George' actions={[<a href='https://github.com/OppenheimerAndTheMartians'>GitHub</a>]}>
        <img src="../../assets/ian_img.jpeg" className="circle" />
        </Card>
      </Col>
      <Col>
        <Card key={'card3'} className='white' title='Sherry Hsu' actions={[<a href='https://github.com/SherryH'>GitHub</a>]}>
        <img src="../../assets/sherry_img.jpeg" className="circle" />
        </Card>
      </Col>
      </Row>
      </div>
    );
  }
}
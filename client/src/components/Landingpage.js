import React from 'react';
import { Row, Col, Card } from 'react-materialize';

// Todo: When using actual images, set max-height and max-width based on % so it scales

export default class Landingpage extends React.Component {
  render() {
    return (
      <div className="landing">
        <div className="row">
          <h3 className="center"> Welcome to FocusPro.</h3>
          <h5 className="center"> We help you limit distractions and stay on task. </h5>
          <br /><br />
          <Row s={6}>
            <Col s={6}>
              <img className="placeholder z-depth-4" src="../../assets/Landingpage.png" alt="dashboard" />
            </Col>
            <Col s={6}>
              <br /><br /><br /> <br />
              FocusPro helps you set goals while tracking your progress in accomplishing them.
              You can blacklist websites to limit distractions by either blocking them directly, or having FocusPro warn you when you have exceeded the time limit you have set.
            </Col>
          </Row>
          <Row s={6}>
            <Col s={7}>
              <br /><br />
              <h5>Companion Google Chrome Extension</h5>
              Use our Chrome extension to track your tab usage and to send you alert messages and self-reflection questions.
              Download here.
            </Col>
            <Col s={5}>
              <br />
              <img src="../../assets/icon128.png" alt="Chrome extension icon" className="FPicon z-depth-4 circle"/>
            </Col>
          </Row>
          <br />
          <h5 className="center"> Meet the Team </h5>
          <div className="meetTeam">
            <Row>
              <Col>
                <Card s={3} className="white" title="Jeff Bentler" actions={[<a href="https://github.com/bentljm">GitHub</a>]}>
                  <img key={14} src="../../assets/jeff_img.jpeg" className="circle" alt="Jeff" />
                </Card>
              </Col>
              <Col>
                <Card s={3} className="white" title="Josephine C." actions={[<a href="https://github.com/Josephine-Chen">GitHub</a>]}>
                  <img key={15} src="../../assets/josephine_img.jpeg" className="circle" alt="Josephine" />
                </Card>
              </Col>
              <Col>
                <Card s={3} className="white" title="Ian George" actions={[<a href="https://github.com/OppenheimerAndTheMartians">GitHub</a>]}>
                  <img key={16} src="../../assets/ian_img.jpeg" className="circle" alt="Ian" />
                </Card>
              </Col>
              <Col>
                <Card s={3} className="white" title="Sherry Hsu" actions={[<a href="https://github.com/SherryH">GitHub</a>]}>
                  <img key={17} src="../../assets/sherry_img.jpeg" className="circle" alt="Sherry" />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

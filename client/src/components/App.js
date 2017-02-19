import React, { Component } from 'react';
import Landingpage from './Landingpage.js';
import {Sidebar} from './Sidebar.js';
import {Grid, Row, Col} from 'react-materialize';

export default class App extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    //pass auth to all children elements
    let children = null;
    if (this.props.children) {
      //add the auth property to each of children
      children = React.cloneElement(this.props.children,{
        auth: this.props.route.auth
      });
    }
    return (
      <div>
        <Sidebar auth={this.props.route.auth}/>
        <main>
          <Row>
          <Col s= {1}> </Col>
          <Col s={11}>
          <div className="container">
            {children}
          </div>
          </Col>
          </Row>
        </main>
      </div>
    );
  }
}




import React from 'react';
import { Row, Input, Button } from 'react-materialize';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table, Column, Cell } from 'fixed-data-table';
import { getReflectionsAjax } from '../utils/SettingsUtil';

class MyTextCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    return (
      <Cell {...props}>
        {data[rowIndex][field]}
      </Cell>
    );
  }
}

class MyLinkCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <Cell {...props}>
        <a href={link}>{link}</a>
      </Cell>
    );
  }
}

export default class Selfreflection extends React.Component {
  constructor(props) { // Hand downs the prop chain
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(), // it gets imported here
      reflections: [],
      answer: '',
      question: '',
      myTableData: [
        {name: 'Rylan', email: 'Angelita_Weimann42@gmail.com'},
        {name: 'Amelia', email: 'Dexter.Trantow57@hotmail.com'},
        {name: 'Estevan', email: 'Aimee7@hotmail.com'},
        {name: 'Florence', email: 'Jarrod.Bernier13@yahoo.com'},
        {name: 'Tressa', email: 'Yadira1@hotmail.com'},
      ],
      products: [{
            id: 1,
            name: "Product1",
            price: 120
        }, {
            id: 2,
            name: "Product2",
            price: 80
        }],
    };
    this.getReflections = this.getReflections.bind(this);
    // this.postReflections = this.postReflections.bind(this);
    this.handleCAnswerhange = this.handleAnswerChange.bind(this);
  }

  componentDidMount() {
    this.getReflections();
    this.callCustomJQuery();
  }

/*
        that.setState({
          reflections: data.data
        });
*/
  getReflections() {
    const that = this;
    getReflectionsAjax(this.state.profile.user_id, (data) => {
      that.setState({
        reflections: data.data,
      });
    });
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  // postReflections() {
  //   $.ajax({
  //     type: 'POST',
  //     url: `/api/users/${this.state.profile.user_id}/reflections`,
  //     contentType: 'application/json',
  //     data: JSON.stringify({
  //       answer: this.state.answer,
  //       question: this.state.question,
  //       auth0_id: this.state.profile.user_id
  //     }),
  //     success: (data) => {
  //       console.log('SUCCESS: POSTED REFLECTIONS: ', data);
  //     },
  //     error: (err) => {
  //       console.log('ERROR: COULD NOT POST REFLECTION', err);
  //     }
  //   });
  // }

  handleAnswerChange(event) {
    this.setState({
      answer: event.target.value
    });
  }

  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>

        <BootstrapTable data={this.state.products} striped hover>
            <TableHeaderColumn isKey dataField='id'>Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
            <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
        </BootstrapTable>


      </div>
    );
  }
}



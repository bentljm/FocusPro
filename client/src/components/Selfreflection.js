import React from 'react';
import { Row, Input, Button } from 'react-materialize';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import moment from 'moment'
import { getReflectionsAjax } from '../utils/SettingsUtil';

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
      const reflectionData = data.data.slice();
      (data.data).forEach((refl, index) => {
        reflectionData[index].date = moment(refl.updatedAt).calendar();
      });
      console.log('reflection.date', reflectionData);
      console.log('reflection.date', data.data);
      that.setState({
        reflections: reflectionData,
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

  getCaret(direction) {
    if (direction === 'asc') {
      return (
        <i className="fa fa-caret-up" aria-hidden="true"></i>
      );
    }
    if (direction === 'desc') {
      return (
        <i className="fa fa-caret-down" aria-hidden="true"></i>
      );
    }
    return (
      <i className="fa fa-sort" aria-hidden="true"></i>
    );
  }

  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>

        <BootstrapTable data={this.state.reflections} striped hover>
            <TableHeaderColumn hidden isKey dataField="id">ID</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField="question" tdStyle={{ whiteSpace: "normal" }} caretRender={ this.getCaret }>Question </TableHeaderColumn>
            <TableHeaderColumn dataField="answer" tdStyle={ { whiteSpace: "normal" } }>Answer </TableHeaderColumn>
            <TableHeaderColumn dataSort dataField="date" tdStyle={ { whiteSpace: "normal" } } caretRender={ this.getCaret } width="100">Date </TableHeaderColumn>
        </BootstrapTable>


      </div>
    );
  }
}


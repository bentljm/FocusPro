import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import { getReflectionsAjax } from '../utils/SettingsUtil';

export default class Selfreflection extends React.Component {
  constructor(props) { // Hand downs the prop chain
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(), // it gets imported here
      reflections: [],
      answer: '',
      question: '',
    };
    this.getReflections = this.getReflections.bind(this);
    this.handleCAnswerhange = this.handleAnswerChange.bind(this);
    this.sortByUTC = this.sortByUTC.bind(this);

    this.options = {
      defaultSortName: 'id',  // default sort column
      defaultSortOrder: 'desc',  // default sort order
      sizePerPageList: [ {
        text: '5 questions per page', value: 5
      }, {
        text: '10 questions per page', value: 10
      }, {
        text: '25 questions per page', value: 25
      },{
        text: 'All', value: this.state.reflections.length
      } ], // you can change the dropdown list for size per page
    };
  }

  componentDidMount() {
    this.getReflections();
  }

  getReflections() {
    const that = this;
    getReflectionsAjax(this.state.profile.user_id, (data) => {
      const reflectionData = data.data.slice();
      // transform data into format accepted by datatable
      (data.data).forEach((refl, index) => {
        reflectionData[index].date = moment(refl.updatedAt).calendar();
      });
      that.setState({
        reflections: reflectionData,
      });
    });
  }

  getCaret(direction) {
    if (direction === 'asc') {
      return (<i className="fa fa-caret-up" aria-hidden="true" />);
    }
    if (direction === 'desc') {
      return (
        <i className="fa fa-caret-down" aria-hidden="true" />
      );
    }
    return (
      <i className="fa fa-sort" aria-hidden="true" />
    );
  }

  sortByUTC(a, b, order) {
    return order === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
  }

  handleAnswerChange(event) {
    this.setState({
      answer: event.target.value,
    });
  }


  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>
        <div className="settingsBox z-depth-4">
        <br />
        Self-reflection questions are sent daily in reminders. Once answered, the questions and answers will be displayed below. If reminders are not set, you will not receive questions.
        <BootstrapTable data={this.state.reflections} options={this.options} striped hover pagination>
          <TableHeaderColumn hidden datasort isKey dataField="id">ID</TableHeaderColumn>
          <TableHeaderColumn dataSort dataField="question" tdStyle={{ whiteSpace: 'normal' }} caretRender={this.getCaret}>Question </TableHeaderColumn>
          <TableHeaderColumn dataField="answer" tdStyle={{ whiteSpace: 'normal' }}>Answer </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField="date" tdStyle={{ whiteSpace: 'normal' }} caretRender={this.getCaret} width="100">Date </TableHeaderColumn>
        </BootstrapTable>
        </div>
      </div>
    );
  }
}


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

    this.options = {
      defaultSortName: 'date',  // default sort column
      defaultSortOrder: 'asc',  // default sort order
    };
  }

  componentDidMount() {
    this.getReflections();
    this.callCustomJQuery();
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
      return ( <i className="fa fa-caret-up" aria-hidden="true" /> );
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

  handleAnswerChange(event) {
    this.setState({
      answer: event.target.value
    });
  }

  callCustomJQuery() {
    $('.collapsible').collapsible();
  }

  render() {
    return (
      <div>
        <h1> Self-Reflection </h1>

        <BootstrapTable data={this.state.reflections} options={this.options} striped hover pagination>
          <TableHeaderColumn hidden isKey dataField="id">ID</TableHeaderColumn>
          <TableHeaderColumn dataSort dataField="question" tdStyle={{ whiteSpace: 'normal' }} caretRender={this.getCaret}>Question </TableHeaderColumn>
          <TableHeaderColumn dataField="answer" tdStyle={{ whiteSpace: 'normal' }}>Answer </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField="date" tdStyle={{ whiteSpace: 'normal' }} caretRender={this.getCaret} width="100">Date </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}


import React from 'react';
import { Row, Input, Button, Table } from 'react-materialize';
import { getExtensionDataAjax, getBlacklistAjax } from '../utils/SettingsUtil';

export default class ReflectionQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      extensionData: [],
    };
  }

  componentDidMount() {
    this.getBlacklist();
  }

  getBlacklist() {
    getBlacklistAjax(this.state.profile.user_id, (data) => {
      this.getExtensionData(data.data);
    });
  }

  getExtensionData(blacklistData) {
    const exDataArr = [];
    blacklistData.forEach((blacklist) => {
      getExtensionDataAjax(blacklist, (exData) => {
        exDataArr.push(exData);
      });
    });
    this.setState({
      extensionData: exDataArr,
    });
  }

  render() {
    return (
      <div>
        {console.log('load blacklist func?', getBlacklistAjax)}
        <h1>Awareness Questions </h1>
        <h5>How much time have you been spending on the blacklist sites?</h5>
        <AwarenessQuestionTable exData={this.state.extensionData} />
        <Button>Answer Awareness Questions</Button>
        <br />
        <br />
        <Row>
          <h1>Reflection Questions</h1>
          <h5>Not bad, you are aware of how much time you lost on the distraction sites! Please think about:</h5>
        </Row>
        <Row>
          <div>What is already working in your system that you can build on?</div>
          <Input s={12}></Input>
        </Row>
        <Row>
          <div>What might 'help' look like?</div>
          <Input s={12}></Input>
        </Row>
      </div>
    );
  }


}

const AwarenessQuestionTable = ({ exData }) => (
  <Table>
    <thead>
      <tr>
        <th data-field="sites">Blacklist sites</th>
        <th data-field="guessedTime">Time you think you spent</th>
        <th data-field="actualTime">Actual time spent (min)</th>
      </tr>
    </thead>
    <tbody>
      {exData.map(data => (
        <tr>
          <td>{data.url}</td>
          <td><Input type="select">
            <option value="0"></option>
            <option value="1">0~30min</option>
            <option value="2">30min~1hr</option>
            <option value="3">1hr~2hr</option>
            <option value="4">2hr+</option>
          </Input></td>
          <td>{data.time_spent}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

import React from 'react';
import {Link} from 'react-router';
import { Row, Input, Button, Table } from 'react-materialize';
import { getExtensionDataAjax, getBlacklistAjax, postReflectionAjax } from '../utils/SettingsUtil';
import { questionSet1, questionSet2, questionSet3, questionSet4 } from '../utils/QuestionSets';

export default class ReflectionQuestion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      extensionData: [],
      displayStatus: { display: 'none' },
      questionSet: null,
    };
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTimeSubmit = this.handleTimeSubmit.bind(this);
    this.getBlacklist = this.getBlacklist.bind(this);
    this.getExtensionData = this.getExtensionData.bind(this);
    this.displayOpenQuestions = this.displayOpenQuestions.bind(this);
    this.setAnswerColor = this.setAnswerColor.bind(this);
    this.handleRelfectionSubmit = this.handleRelfectionSubmit.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.transformQAData = this.transformQAData.bind(this);

    this.TIME_SELECTION_MAP = {
      0: [0, 0],
      1: [0, 30],
      2: [30, 60],
      3: [60, 120],
      4: [120, Number.MAX_SAFE_INTEGER],
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
  // save the blacklist_time with extensionData
  getExtensionData(blacklistData) {
    const exDataArr = [];
    blacklistData.forEach((blacklist) => {
      getExtensionDataAjax(blacklist, (exData) => {
        const data = exData;
        data.blacklist_time = blacklist.blacklist_time;
        exDataArr.push(data);
      });
    });
    this.setState({
      extensionData: exDataArr,
    });
  }

  setAnswerColor() {
    const exDataArrTemp = Array.from(this.state.extensionData);
    for (let i = 0; i < exDataArrTemp.length; i++) {
      const timeRange = this.TIME_SELECTION_MAP[exDataArrTemp[i].time_guessed];

      exDataArrTemp[i].color = 'text-red';
      if (timeRange) {
        if ((exDataArrTemp[i].time_spent >= timeRange[0]) && (exDataArrTemp[i].time_spent < timeRange[1])) {
          exDataArrTemp[i].color = 'text-green';
        }
      }
      console.log('url color', exDataArrTemp[i].url, exDataArrTemp[i].color);
    }
    this.setState({
      extensionData: exDataArrTemp,
    });
  }

  isAwareOfTime(exDataArr) {
    return exDataArr.every((list) => {
      if (!list.time_guessed) {
        return false;
      }
      const timeRange = this.TIME_SELECTION_MAP[list.time_guessed];
      return (list.time_spent >= timeRange[0]) && (list.time_spent < timeRange[1]);
    });
  }

  isStickToTime(exDataArr) {
    return exDataArr.every((list) => {
      const timeSpent = list.time_spent || 0;
      console.log('time vs bt', timeSpent, list.blacklist_time);
      return (timeSpent <= list.blacklist_time);
    });
  }

  handleTimeSubmit() {
    let awareOfTime = true;
    let stickToTime = true;

    awareOfTime = this.isAwareOfTime(this.state.extensionData);
    console.log('awareOfTime', awareOfTime);
    stickToTime = this.isStickToTime(this.state.extensionData);
    console.log('stickToTime', stickToTime);


    this.displayOpenQuestions(awareOfTime, stickToTime);
    this.setAnswerColor();
  }

  // save user guessed time with extensionData
  handleTimeChange(event, key) {
    const tempArr = this.state.extensionData;
    console.log('extensionData change', tempArr, key);
    tempArr[key].time_guessed = event.target.value;
    this.setState({
      extensionData: tempArr,
    });
  }

  displayOpenQuestions(awareOfTime, stickToTime) {
    const displayStatusTemp = Object.assign({}, this.state.displayStatus);
    displayStatusTemp.display = 'table-cell';
    this.setState({
      displayStatus: displayStatusTemp,
    });
    // based on users awareOfTime and stickToTime
    if (awareOfTime && stickToTime) {
      this.setState({
        questionSet: questionSet1,
      });
    } else if (!awareOfTime && stickToTime) {
      this.setState({
        questionSet: questionSet2,
      });
    } else if (awareOfTime && !stickToTime) {
      this.setState({
        questionSet: questionSet3,
      });
    } else {
      this.setState({
        questionSet: questionSet4,
      });
    }
  }

  handleRelfectionSubmit() {
    const qaArray = this.transformQAData();
    qaArray.forEach((qa) => {
      postReflectionAjax(this.state.profile.user_id, qa, (data)=>{
        console.log('submit reflection', data);
      });
    });

  }

  transformQAData() {
    const data = [];
    this.state.questionSet.questions.forEach((q, index) => {
      const obj = {};
      obj.question = q;
      obj.answer = this.state.questionSet.answers[index];
      data.push(obj);
    });
    return data;
  }

  handleAnswerChange(event, index) {
    const qSetTemp = this.state.questionSet;
    qSetTemp.answers = this.state.questionSet.answers ||Array.from(Array(this.state.questionSet.questions.length));
    qSetTemp.answers[index] = event.target.value;
    this.setState({
      questionSet: qSetTemp,
    }, ()=>{
      console.log('questionSet', this.state.questionSet);
    });
  }

  render() {
    return (
      <div>
        {console.log('load blacklist func?', getBlacklistAjax)}
        <h1>Awareness Questions </h1>
        <h5>How much time have you been spending on the blacklist sites?</h5>
        <AwarenessQuestionTable exData={this.state.extensionData} callback={this.handleTimeChange} theStyle={this.state.displayStatus} />
        <Button onClick={this.handleTimeSubmit}>Answer Awareness Questions</Button>
        <br />
        <br />
        {console.log('questionSet', this.state.questionSet)}
        <OpenQuestions qSet={this.state.questionSet} callback={this.handleAnswerChange} submitCallback={this.handleRelfectionSubmit}/>

      </div>
    );
  }


}

const AwarenessQuestionTable = ({ exData, callback, theStyle }) => (
  <Table>
    <thead>
      <tr>
        <th data-field="sites">Blacklist sites</th>
        <th data-field="guessedTime">Time you think you spent</th>
        <th data-field="actualTime">Actual time spent (min)</th>
      </tr>
    </thead>
    <tbody>
      {exData.map((data, ind) => (
        <tr key={ind.toString()}>
          <td>{data.url}</td>
          <td><Input type="select" onChange={e => callback(e, ind.toString())}>
            <option value="0" />
            <option value="1">0~30min</option>
            <option value="2">30min~1hr</option>
            <option value="3">1hr~2hr</option>
            <option value="4">2hr+</option>
          </Input></td>
          <td style={theStyle} className={data.color}>{data.time_spent}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const OpenQuestions = ({ qSet, callback, submitCallback }) => (
  <div>
    {qSet && <div>
      <Row>
        <h1>Reflection Questions</h1>
        <Feedback feedback={qSet.feedback} />
        {console.log('qset feedback', qSet, qSet.feedback)}
      </Row>
      {qSet.questions.map((question, ind) => (
        <Row key={ind.toString()}>
          <div>{question}</div>
          <Input s={12} onChange={e => callback(e, ind.toString())} />
        </Row>
      ))}
      <Button onClick={submitCallback}><Link to="/selfreflection">Save Reflection</Link></Button>
    </div>}
  </div>
);

const Feedback = ({ feedback }) => (
  <div style={{ color: 'blue' }} dangerouslySetInnerHTML={{ __html: feedback }} />
);

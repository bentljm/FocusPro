import React from 'react';
import { Row, Input, Button, Table } from 'react-materialize';
import { getExtensionDataAjax, getBlacklistAjax } from '../utils/SettingsUtil';

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
  // save user guessed time with extensionData
  handleTimeChange(event, key) {
    const tempArr = this.state.extensionData;
    console.log('extensionData change', tempArr, key);
    tempArr[key].time_guessed = event.target.value;
    this.setState({
      extensionData: tempArr,
    }, ()=>{
      console.log('after input change',this.state.extensionData);
    });
  }

  isAwareOfTime(exDataArr) {
    const timeSelectionMap = {
      0: [0, 0],
      1: [0, 30],
      2: [30, 60],
      3: [60, 120],
      4: [120, Number.MAX_SAFE_INTEGER],
    };
    return exDataArr.every((list) => {
      if (!list.time_guessed) {
        return false;
      }
      const timeRange = timeSelectionMap[list.time_guessed];
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
  }

  displayOpenQuestions(awareOfTime, stickToTime) {
    const questionSet1 = {
      feedback: 'Well done! <br /> Looks like you are on track to achieve your ultimate dream goal :D <br /> Keep it up as consistency is the key!',
      questions:['What is already working in your system that can help enhacing self-discipline further?'],
    };
    const questionSet2 = {
      feedback: 'Very good! You have shown good discipline today :D <br /> It seems that you could have done better at tracking the time spent on the distraction site.',
      questions:['How would performance change if you are more aware of how your time is spent?',
      'What system can you implement to help you achieve that?'],
    };
    const questionSet3 = {
      feedback: 'Not bad, you are aware of how much time you lost on the distraction site so you knew that you still went over your allocated time. <br /> Please think about:',
      questions:['What is already working in your system that you can build on?',
      'What might "help" look like?'],
    };
    const questionSet4 = {
      feedback: 'Oops, not knowing how much time you spent on distraction sites... it seems like you are not on track to achieving you dream goal! Setting smaller yet achievable goals/rules is better than not achieving anything. <br /> Please think about:',
      questions:['In the beginning, how did you want it to be?',
      'What is the best/worst thing that could happen if you continue this way?',
      'What might "help" look like?',
      'How can you make yourself accountable?'],
    };
    this.setState({
      displayStatus: {display: 'block'},
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

  render() {
    return (
      <div>
        {console.log('load blacklist func?', getBlacklistAjax)}
        <h1>Awareness Questions </h1>
        <h5>How much time have you been spending on the blacklist sites?</h5>
        <AwarenessQuestionTable exData={this.state.extensionData} callback={this.handleTimeChange}/>
        <Button onClick={this.handleTimeSubmit}>Answer Awareness Questions</Button>
        <br />
        <br />
        {console.log('questionSet', this.state.questionSet)}
        <OpenQuestion theStyle={this.state.displayStatus} qSet={this.state.questionSet}/>
      </div>
    );
  }


}

const AwarenessQuestionTable = ({ exData, callback }) => (
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

const OpenQuestion = ({theStyle, qSet}) => (
  <div>
    {qSet && <div style={theStyle}>
      <Row>
        <h1>Reflection Questions</h1>
        <Feedback feedback={qSet.feedback} />
        {console.log('qset feedback', qSet, qSet.feedback)}
      </Row>
      {qSet.questions.map((question, ind)=>(
        <Row key={ind.toString()}>
          <div>{question}</div>
          <Input s={12}></Input>
        </Row>
      ))}
    </div>}
  </div>
);

const Feedback = ({feedback}) => (
  <div style={{color:'blue'}} dangerouslySetInnerHTML={{ __html: feedback }} />
);
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
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
    let url;
    let count = 0; // counting when all async calls finish
    blacklistData.forEach((blacklist) => {
      getExtensionDataAjax(this.state.profile.user_id, (data) => {
        // for each blacklist site, e.g. github.com
        // data returned include http://gist.github.com, http://www.github.com
        const listArr = (data.data).filter((urlObj) => {
          // each url in DB, remove http://www
          // return if blacklist contains the blacklist-url in DB
          url = (urlObj.url).replace(/http(s*)\:\/\/([www.]*)/, '');
          console.log('blacklist.url', blacklist.url, 'url', url, 'length', data.data.length);
          return new RegExp(url).test(blacklist.url);
        });

        // For eahc blacklist URL, aggregate the information in similar URLs e.g. http(s)://www.facebook.com
        // {url: , blacklist_time: , time_spent: }
        // time_spent is the aggregation of time_spent today from listArr.history
        if (listArr.length > 0) {
          // aggregate the time spent in each list in listArr
          // set the url to be that of blacklist.url
          const listTemp = { time_spent: 0 };
          // listArr.forEach(list => {
          //   console.log('list',list);
          //   // loop thru each elem in history array, if array[0] is today
          //   (list.history).forEach(history => {
          //     // console.log('history', history);
          //     const aDay = moment(new Date(+history[0])).format('DD/MM/YYYY');
          //     // const today = moment(new Date()).format('DD/MM/YYYY');
          //     const today = '09/03/2017';
          //     // console.log('aDay', aDay.toString(), 'today',today.toString(), 'history[1]', history[1]);
          //     if (today.toString() === aDay.toString()) {
          //       listTemp.time_spent = listTemp.time_spent + parseInt(history[1]);
          //     }

          //   });
          //   listTemp.url = blacklist.url;
          //   listTemp.blacklist_time = blacklist.blacklist_time;
          // });

          // listArry may include http://www.github.com and https://www.github.com
          // take only one list to compute time_spent as they store duplicate results
          // history array [date, accumulated time so far]
          // find the first occurance of today's history, subtract its time_spent
          // const lastHistoryInd = listArr[0].history.length - 1;
          // const today = moment(new Date()).format('DD/MM/YYYY');
          // for (let i = lastHistoryInd; i >= 0; i--) {
          //   // find the first time when history's date is not today
          //   // a date in history: listArr[0].history[i][0]
          //   const aDay = moment(new Date(+listArr[0].history[i][0])).format('DD/MM/YYYY');
          //   if (aDay.toString() !== today.toString() || i === 0) {
          //     console.log('aDay', aDay, 'today', today);
          //     // the first occurance of yesterday's data!
          //     // take the last record of today's data from history[i-1]
          //     const finalTimeSp = listArr[0].history[lastHistoryInd][1];
          //     console.log('finalTimeSp',finalTimeSp);
          //     console.log('listArr[0].history[i]',listArr[0].history[i],'listArr[0].history[i+1]',listArr[0].history[i+1]);
          //     if (i === lastHistoryInd) {
          //       listTemp.time_spent = 0;
          //     } else {
          //       listTemp.time_spent = finalTimeSp - listArr[0].history[i+1][1];
          //     }
          //     break;
          //   }
          // }
          listTemp.time_spent = listArr[0].time_spent;
          listTemp.url = blacklist.url;
          listTemp.blacklist_time = blacklist.blacklist_time;

          exDataArr.push(listTemp);
        }
        // if user has not opened the blacklist site at all
        if (data.data.length === 0) {
          exDataArr.push({
            url: blacklist.url,
            blacklist_time: blacklist.blacklist_time,
            time_spent: 0
          });
        }
        // console.log('exDataArr', exDataArr);
        // set state when all blacklist extension data have been extracted
        count += 1;
        // console.log('count', count, 'blacklistData.length', blacklistData.length);
        if (count === blacklistData.length) {
          this.setState({
            extensionData: exDataArr,
          }, () => {
            console.log('this.state.extensionData', this.state.extensionData);
          });
        }
      }, blacklist); // end extension data Ajax
    }); // end blacklist forEach
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
      postReflectionAjax(this.state.profile.user_id, qa, (data) => {
        console.log('submit reflection', data);
        window.location = '/#/selfreflection';
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
    qSetTemp.answers = this.state.questionSet.answers || Array.from(Array(this.state.questionSet.questions.length));
    qSetTemp.answers[index] = event.target.value;
    this.setState({
      questionSet: qSetTemp,
    });
  }

  render() {
    return (
      <div>
        <h1>Awareness Questions </h1>
        <h5>How much time have you been spending on the blacklist sites?</h5>
        <AwarenessQuestionTable exData={this.state.extensionData} callback={this.handleTimeChange} theStyle={this.state.displayStatus} />
        <Button onClick={this.handleTimeSubmit}>Answer Awareness Questions</Button>
        <br />
        <br />
        <OpenQuestions qSet={this.state.questionSet} callback={this.handleAnswerChange} submitCallback={this.handleRelfectionSubmit} />
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

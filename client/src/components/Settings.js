import React from 'react';
import { Table, Input, Row, Button, Icon } from 'react-materialize';
import { extend } from 'underscore';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      username: '',
      setting: {},
      userId: '',
      blacklist: [],
      siteURL: '',
      siteType: '',
      siteLimit: 0,
      image: '',
      quote: '',
      reminderType: '',
      reminderFreq: 0,
      reminderAddress: '',
      reminderClicked: false,
      labelStyle: {},
      inputStyle: {},
    };
    this.handleReminderSubmission = this.handleReminderSubmission.bind(this);
    this.deleteBlacklist = this.deleteBlacklist.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
    this.siteFormsFilled = this.siteFormsFilled.bind(this);
    this.editStyle = this.editStyle.bind(this);
    this.viewStyle = this.viewStyle.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getUserId();
    this.getSetting();
    this.getBlacklist();
  }

  componentDidUpdate() {
    // this.initialiseSettings();
  }

  getUserId() {
    const that = this;
    $.ajax({
      type: 'GET',
      url: `/api/users/${this.state.profile.user_id}`,
      success: (data) => {
        console.log('SUCCESS: GOT USERID', data.data[0].id);
        that.setState({ userId: data.data[0].id });
        that.setState({ username: data.data[0].username || this.state.profile.nickname });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET USERID', err); },
    });
  }

  getSetting() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/setting`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED SETTINGS: ', data);
        that.setState({ setting: data.data[0] }, () => {
          console.log('get setting', that.state.setting);
          that.initialiseSettings();
        });
        // that.setState({ image: data.data[0].picture });
        // that.setState({ quote: data.data[0].quote });
        that.setState({
          image: data.data[0].picture,
          quote: data.data[0].quote,
          reminderType: data.data[0].reminder_type,
          reminderFreq: data.data[0].reminder_freq,
          reminderAddress: data.data[0].reminder_address,
        });
        // that.initialiseSettings();
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SETTINGS', err); },
    });
  }

  getBlacklist() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/blacklist`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED BLACKLIST: ', data.data);
        that.setState({ blacklist: data.data });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET BLACKLIST', err); },
    });
  }

  updateSetting(pic, quote, refl_freq, remind, remind_type, remind_freq, remind_addr) {
    console.log(remind_freq);
    $.ajax({
      type: 'PUT',
      url: `/api/users/${this.state.profile.user_id}/setting`,
      contentType: 'application/json',
      data: JSON.stringify({
        picture: pic || this.state.setting.picture,
        quote: quote || this.state.setting.quote,
        reflection_freq: refl_freq || this.state.setting.reflection_freq,
        reminder: remind || this.state.setting.reminder,
        reminder_type: remind_type || this.state.setting.reminder_type,
        reminder_freq: remind_freq || this.state.setting.reminder_freq,
        reminder_address: remind_addr || this.state.setting.reminder_address }),
      success: (data) => { console.log('SUCCESS: POSTED SETTING: ', data); },
      error: (err) => { console.log('ERROR: COULD NOT POST SETTING', err); },
    });
  }


  postBlacklist(siteURL, siteType, siteTime) {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `/api/users/${this.state.profile.user_id}/blacklist`,
      contentType: 'application/json',
      data: JSON.stringify({ url: siteURL, blacklist_type: siteType, blacklist_time: siteTime, SettingId: that.state.setting.id }),
      success: (data) => {
        console.log('SUCCESS: POSTED BLACKLIST: ', data);
        that.getBlacklist();
        that.alertUser('Blacklist site');
        that.setState({
          siteURL: '',
          siteType: '',
          siteLimit: 0,
        });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET USERID', err); },
    });
  }

  deleteBlacklist(url_id) {
    const that = this;
    $.ajax({
      type: 'DELETE',
      url: `/api/blacklist/${url_id}`,
      success: (data) => {
        console.log('Sucessfully deleted', data);
        that.getBlacklist();
      },
      error: (err) => { console.log('Error deleting', err); },
    });
  }

  updateUsername(username) {
    const that = this;
    $.ajax({
      type: 'PUT',
      url: `/api/users/${this.state.profile.user_id}/username`,
      contentType: 'application/json',
      data: JSON.stringify({ username }),
      success: () => {
        console.log('SUCCESS: UPDATED USERNAME');
        that.alertUser('Username');
      },
      error: (err) => { console.log('ERROR: COULD NOT GET USERID', err); },
    });
  }

  sendNotification() {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `/api/users/${this.state.profile.user_id}/sendNotification`,
      contentType: 'application/json',
      data: JSON.stringify({ address: this.state.reminderAddress, name: this.state.profile.given_name, freq: this.state.reminderFreq }),
      success: (data) => {
        console.log('SUCCESS: SENT NOTIFICATIONS', data);
        that.alertUser('Email notification');
        that.setState({ reminderClicked: false });
      },
      error: (err) => { console.log('ERROR: COULD NOT SEND NOTIFICATIONS', err); },
    });
  }

  handleReminderSubmission() {
    this.updateSetting(null, null, null, true, this.state.reminderType, this.state.reminderFreq, this.state.reminderAddress);
    this.setState({ reminderClicked: true });
    this.alertUser('Reminder');
  }

  handleChange(event, str) {
    this.setState({ [str]: event.target.value });
  }

  handleSubmission(str) {
    const that = this;
    const delegator = {
      quote: () => {
        that.updateSetting(null, that.state.quote);
        that.alertUser('Quote');
      },
      image: () => {
        that.updateSetting(this.state.image);
        that.alertUser('Image');
      },
      username: () => {
        this.updateUsername(this.state.username.trim());
      },
      site: () => {
        this.postBlacklist(this.state.siteURL, this.state.siteType, this.state.siteLimit);
      },
    };
    delegator[str]();
    that.viewStyle(str);
  }

  handleKeyPress(e, str) {
    // Enter key triggers blur, so don't need to call handleSubmission
    // unless there is no onBlur on the element
    if (e.key === 'Enter') {
      this.viewStyle(str);
      if (str === 'site') {
        if (this.siteFormsFilled()) {
          this.handleSubmission('site');
        }
      }
    }
  }

  siteFormsFilled() {
    return this.state.siteURL.length > 0 && this.state.siteLimit.length > 0 && this.state.siteType.length > 0;
  }

  alertUser(str) {
    Materialize.toast(`${str} set!`, 1000);
  }

  initialiseSettings() {
    const settingList = ['quote'];
    settingList.forEach((item) => {
      if (!this.state.setting[item]) {
        this.editStyle(item);
      } else {
        this.viewStyle(item);
      }
    });

    if (!this.state.setting.picture) {
      this.editStyle('image');
    } else {
      this.viewStyle('image');
    }

    if (!this.state.username) {
      this.editStyle('username');
    } else {
      this.viewStyle('username');
    }
  }

  editStyle(str) {
    this.setState({
      labelStyle: extend(this.state.labelStyle, { [str]: { display: 'none' } }),
      inputStyle: extend(this.state.inputStyle, { [str]: { display: 'block' } }),
    });
  }

  viewStyle(str) {
    this.setState({
      labelStyle: extend(this.state.labelStyle, { [str]: { display: 'block' } }),
      inputStyle: extend(this.state.inputStyle, { [str]: { display: 'none' } }),
    });
  }

  render() {
    const { siteURL, siteLimit, siteType } = this.state;
    let siteSubmitEnabled;
    if (siteURL && siteLimit && siteType) {
      siteSubmitEnabled = siteURL.length > 0 && siteLimit.length > 0 && siteType.length > 0;
    }
    const { reminderType, reminderAddress, reminderFreq } = this.state;
    let reminderSubmitEnabled;
    if (reminderType && reminderAddress && reminderFreq) {
      reminderSubmitEnabled = reminderType.length > 0 && reminderAddress.length > 0 && reminderFreq.length > 0;
    }
    const sendNotificationEnabled = this.state.reminderClicked;

    return (
      <div>
        <h1> Settings </h1>
        <h3> Blacklist: </h3>
        {(this.state.blacklist.length === 0) && <div>There is no blacklist url set currently.</div>}
        {this.state.blacklist.length > 0 && <Table>
          <thead>
            <tr>
              <th data-field="id">Site</th>
              <th data-field="type">Type</th>
              <th data-field="limit">Time Limit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.blacklist.map(site => (
              <tr key={`blacklist${site.id}`} >
                <td>{site.url}</td>
                <td>{site.blacklist_type}</td>
                <td>{site.blacklist_time}</td>
                <td><a href="#/settings" onClick={() => this.deleteBlacklist(site.id)}><Icon right>delete</Icon></a></td>
              </tr>
            ))}
          </tbody>
        </Table>}
        <br />
        <Row>
          <Input s={5} label="Site" value={this.state.siteURL} onChange={e => this.handleChange(e, 'siteURL')} onKeyPress={e => this.handleKeyPress(e, 'site')} />
          <Input s={3} type="select" label="Type" defaultValue="1" value={this.state.siteType} onChange={e => this.handleChange(e, 'siteType')}>
            <option value="1">Blackout</option>
            <option value="2">Block after exceeding</option>
            <option value="3">Warn after exceeding</option>
          </Input>
          <Input s={2} label="Time Limit (min)" value={this.state.siteLimit} onChange={e => this.handleChange(e, 'siteLimit')} onKeyPress={e => this.handleKeyPress(e, 'site')} />
          <Button disabled={!siteSubmitEnabled} className="blacklistButton" waves="light" onClick={() => this.handleSubmission('site')}>Add Site</Button>
        </Row>
        <br />
        <h3> Personalization: </h3>
        <Row>
          <div className="label-header">Username:</div>
          <div onDoubleClick={() => this.editStyle('username')} style={this.state.labelStyle.username}>{this.state.username}
          </div>
          <Input s={10} placeholder="Enter Username" value={this.state.username} onChange={e => this.handleChange(e, 'username')} onKeyPress={e => this.handleKeyPress(e, 'username')} onBlur={() => this.handleSubmission('username')} style={this.state.inputStyle.username} />
        </Row>
        <Row>
          <div className="label-header">Image:</div>
          <div onDoubleClick={() => this.editStyle('image')} style={this.state.labelStyle.image}>{this.state.image}
          </div>
          <Input s={10} placeholder="Enter Image URL" value={this.state.image} onChange={e => this.handleChange(e, 'image')} onBlur={() => this.handleSubmission('image')} onKeyPress={e => this.handleKeyPress(e, 'image')} style={this.state.inputStyle.image} />
        </Row>
        <Row>
          <div className="label-header">Quote:</div>
          <div onDoubleClick={() => this.editStyle('quote')} style={this.state.labelStyle.quote}>{this.state.quote}
          </div>
          <Input s={10} placeholder="Enter Motivational Quote" value={this.state.quote} onChange={e => this.handleChange(e, 'quote')} onBlur={() => this.handleSubmission('quote')} onKeyPress={e => this.handleKeyPress(e, 'quote')} style={this.state.inputStyle.quote} />
        </Row>
        <br />
        <Row>
          <Input s={2} type="select" label="Reminder Type" defaultValue="1" value={this.state.reminderType} onChange={e => this.handleChange(e, 'reminderType')}>
            <option value="1">No Reminder</option>
            <option value="2">Text</option>
            <option value="3">Email</option>
          </Input>
          <Input s={6} label="Number/Email Address" value={this.state.reminderAddress} onChange={e => this.handleChange(e, 'reminderAddress')} />
          <Input s={2} type="select" label="Frequency" defaultValue="1" value={this.state.reminderFreq} onChange={e => this.handleChange(e, 'reminderFreq')}>
            <option value="1">Daily</option>
            <option value="2">Weekly</option>
          </Input>
          <Button disabled={!reminderSubmitEnabled} className="reminderButton" waves="light" onClick={this.handleReminderSubmission}>Set Reminder</Button>
          <Button disabled={!sendNotificationEnabled} waves="light" onClick={this.sendNotification}>Send Notification Now</Button>
        </Row>
        <br />
        <h3> Chrome Extension: </h3>
        Forgot to download the extension? Download it here: ___________
        Your id is {this.state.profile.user_id}. Please enter it into the extension to connect.
      </div>
    );
  }
}

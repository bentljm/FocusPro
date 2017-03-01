import React from 'react';
import { Table, Input, Row, Button, Icon } from 'react-materialize';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
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
    };
    this.handleSiteChange = this.handleSiteChange.bind(this);
    this.handleSiteTypeChange = this.handleSiteTypeChange.bind(this);
    this.handleSiteLimitChange = this.handleSiteLimitChange.bind(this);
    this.handleSiteSubmission = this.handleSiteSubmission.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageSubmission = this.handleImageSubmission.bind(this);
    this.handleQuoteSubmission = this.handleQuoteSubmission.bind(this);
    this.handleQuoteChange = this.handleQuoteChange.bind(this);
    this.handleReminderSubmission = this.handleReminderSubmission.bind(this);
    this.handleReminderTypeChange = this.handleReminderTypeChange.bind(this);
    this.handleReminderAddressChange = this.handleReminderAddressChange.bind(this);
    this.handleReminderFreqChange = this.handleReminderFreqChange.bind(this);
    this.deleteBlacklist = this.deleteBlacklist.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
    this.handleImageKeyPress = this.handleImageKeyPress.bind(this);
    this.handleQuoteKeyPress = this.handleQuoteKeyPress.bind(this);
    this.handleSiteKeyPress = this.handleSiteKeyPress.bind(this);
    //this.handleReminderKeyPress = this.handleReminderKeyPress.bind(this);
    this.siteFormsFilled = this.siteFormsFilled.bind(this);
    //this.reminderFormsFilled = this.reminderFormsFilled.bind(this);
  }

  componentDidMount() {
    this.getUserId();
    this.getSetting();
    this.getBlacklist();
  }

  getSetting() {
    const that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: `/api/users/${this.state.profile.user_id}/setting`,
      success: (data) => {
        console.log('SUCCESS: OBTAINED SETTINGS: ', data);
        that.setState({ setting: data.data[0] });
        that.setState({ image: data.data[0].picture });
        that.setState({ quote: data.data[0].quote });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET SETTINGS', err); },
    });
  }

  updateSetting(pic, quote, refl_freq, remind, remind_type, remind_freq, remind_addr) {
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

  postBlacklist(siteURL, siteType, siteTime) {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `/api/users/${this.state.profile.user_id}/blacklist`,
      contentType: 'application/json',
      data: JSON.stringify({ url: siteURL, blacklist_type: siteType, blacklist_time: siteTime, SettingId: this.state.setting.id }),
      success: (data) => {
        console.log('SUCCESS: POSTED BLACKLIST: ', data);
        that.getBlacklist();
      },
      error: (err) => { console.log('ERROR: COULD NOT POST BLACKLIST', err); },
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

  getUserId() {
    const that = this;
    $.ajax({
      type: 'GET',
      url: `api/users/${this.state.profile.user_id}`,
      success: (data) => {
        console.log('SUCCESS: GOT USERID', data.data[0].id);
        that.setState({ userId: data.data[0].id });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET USERID', err); },
    });
  }

  sendNotification() {
    const that = this;
    $.ajax({
      type: 'POST',
      url: `api/users/${this.state.profile.user_id}/sendNotification`,
      contentType: 'application/json',
      data: JSON.stringify({address: this.state.reminderAddress, name: this.state.profile.given_name}),
      success: (data) => {
        console.log('SUCCESS: SENT NOTIFICATIONS', data);
        that.alertUser('Email notification');
        this.setState({ reminderClicked: false });
      },
      error: (err) => { console.log('ERROR: COULD NOT SEND NOTIFICATIONS', err); },
    });
  }

  handleSiteChange(event) {
    this.setState({ siteURL: event.target.value });
  }
  handleSiteTypeChange(event) {
    this.setState({ siteType: event.target.value });
  }
  handleSiteLimitChange(event) {
    this.setState({ siteLimit: event.target.value });
  }
  handleSiteSubmission() {
    this.postBlacklist(this.state.siteURL, this.state.siteType, this.state.siteLimit);
    this.alertUser('Blacklist site');
  }
  handleImageChange(event) {
    this.setState({ image: event.target.value });
  }
  handleQuoteChange(event) {
    this.setState({ quote: event.target.value });
  }
  handleImageSubmission() {
    this.updateSetting(this.state.image);
    this.alertUser('Image');
  }
  handleQuoteSubmission() {
    this.updateSetting(null, this.state.quote);
    this.alertUser('Quote');
  }
  handleReminderTypeChange(event) {
    this.setState({ reminderType: event.target.value });
  }
  handleReminderAddressChange(event) {
    this.setState({ reminderAddress: event.target.value });
  }
  handleReminderFreqChange(event) {
    this.setState({ reminderFreq: event.target.value });
  }
  handleReminderSubmission() {
    this.updateSetting(null, null, null, true, this.state.reminderType, this.state.reminderFreq, this.state.reminderAddress);
    this.setState({ reminderClicked: true });
    this.alertUser('Reminder');
  }
  handleImageKeyPress(e){
    if(e.key == 'Enter'){
      this.handleImageSubmission();
    }
  }
  handleQuoteKeyPress(e){
    if(e.key == 'Enter'){
      this.handleQuoteSubmission();
    }
  }
  handleSiteKeyPress(e){
    if(e.key == 'Enter'){
      if(this.siteFormsFilled())
      this.handleSiteSubmission();
    }
  }
  // handleReminderKeyPress(e){
  //   if(e.key == 'Enter'){
  //     console.log('CLICKED')
  //     if(this.reminderFormsFilled())
  //       console.log('CLICKED')
  //       this.handleReminderSubmission();
  //   }
  // }
  siteFormsFilled() {
    return  this.state.siteURL.length > 0 && this.state.siteLimit.length > 0 && this.state.siteType.length > 0;
  }
  // reminderFormsFilled() {
  //   console.log(this.state.reminderType.length > 0 && this.state.reminderAddress.length > 0 && this.state.reminderFreq.length > 0)
  //   return  this.state.reminderType.length > 0 && this.state.reminderAddress.length > 0 && this.state.reminderFreq.length > 0;
  // }

  alertUser(str) {
    Materialize.toast(`${str} added!`, 1000);
  }


  render() {
    const { siteURL, siteLimit, siteType } = this.state;
    const siteSubmitEnabled = siteURL.length > 0 && siteLimit.length > 0 && siteType.length > 0;
    const { reminderType, reminderAddress, reminderFreq } = this.state;
    const reminderSubmitEnabled = reminderType.length > 0 && reminderAddress.length > 0 && reminderFreq.length > 0;
    const sendNotificationEnabled = this.state.reminderClicked;

    return (
      <div>
        <h1> Settings </h1>
        <h3> Blacklist: </h3>
        <Table>
          <thead>
            <tr>
              <th data-field="id">Site</th>
              <th data-field="type">Type</th>
              <th data-field="limit">Time Limit</th>
            </tr>
          </thead>

          <tbody>
            {this.state.blacklist.map((site, index) => (
              <tr key={index}>
                <td>{site.url}</td>
                <td>{site.blacklist_type}</td>
                <td>{site.blacklist_time}</td>
                <td><a href="#/settings" onClick={() => this.deleteBlacklist(site.id)}><Icon right>delete</Icon></a></td>
            </tr>
            ))}
          </tbody>
        </Table>
        <br />
        <Row>
          <Input s={5} label="Site" value={this.state.siteURL} onChange={this.handleSiteChange} onKeyPress={this.handleSiteKeyPress}/>
          <Input s={3} type="select" label="Type" defaultValue="1" value={this.state.siteType} onChange={this.handleSiteTypeChange} onKeyPress={this.handleSiteKeyPress}>
            <option value="1">Blackout</option>
            <option value="2">Block after exceeding</option>
            <option value="3">Warn after exceeding</option>
          </Input>
          <Input s={2} label="Time Limit (min)" value={this.state.siteLimit} onChange={this.handleSiteLimitChange} onKeyPress={this.handleSiteKeyPress}/>
          <Button disabled={!siteSubmitEnabled} className="blacklistButton" waves="light" onClick={this.handleSiteSubmission}>Add Site</Button>
        </Row>
        <br />
        <h3> Personalization: </h3>
        <Row>
          <Input s={10} label="Image" value={this.state.image} onChange={this.handleImageChange} onKeyPress={this.handleImageKeyPress}/>
          <Button className="picButton" waves="light" onClick={this.handleImageSubmission}>Set Image</Button>
        </Row>
        <Row>
          <Input s={10} label="Quote" value={this.state.quote} onChange={this.handleQuoteChange} onKeyPress={this.handleQuoteKeyPress}/>
          <Button className="quoteButton" waves="light" onClick={this.handleQuoteSubmission}>Set Quote</Button>
        </Row>
        <br />
        <Row>
          <Input s={2} type="select" label="Reminder Type" defaultValue="1" value={this.state.reminderType} onChange={this.handleReminderTypeChange}>
            <option value="1">No Reminder</option>
            <option value="2">Text</option>
            <option value="3">Email</option>
          </Input>
          <Input s={6} label="Number/Email Address" value={this.state.reminderAddress} onChange={this.handleReminderAddressChange}/>
          <Input s={2} type="select" label="Frequency" defaultValue="1" value={this.state.reminderFreq} onChange={this.handleReminderFreqChange}>
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

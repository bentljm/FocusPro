import React from 'react';
import {Table, Input, Row, Col} from 'react-materialize';

//TODO: Create setting with placeholders in db
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      setting:{},
      userId: '',
      blacklist: {}
    };
  }

  componentDidMount(){
    this.getUserId();
    this.getSetting();
  }

  getSetting() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/' + this.state.profile.user_id + '/setting',
      success: function(data) {
        console.log("SUCCESS: OBTAINED SETTINGS: ", data);
        that.setState({setting: data.data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET SETTINGS", err);}
    });
  }

  updateSetting(pic, quote, refl_freq, remind, remind_type, remind_freq, remind_addr) {
    $.ajax({
      type: 'PUT',
      url: '/api/users/' + this.state.profile.user_id + '/setting',
      contentType: 'application/json',
      data: JSON.stringify({picture: pic || this.state.setting.picture,
        quote: quote || this.state.setting.quote,
        reflection_freq: refl_freq || this.state.setting.reflection_freq,
        reminder: remind || this.state.setting.reminder,
        reminder_type: remind_type || this.state.setting.reminder_type,
        reminder_freq: remind_freq || this.state.setting.reminder_freq,
        reminder_address: remind_addr || this.state.setting.reminder_address}),
      success: function(data) {console.log("SUCCESS: POSTED SETTING: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST SETTING", err);}
    });
  }

  getBlacklist() {
    var that = this;
    $.ajax({
      type: 'GET', // GET REQUEST
      url: '/api/users/' + this.state.profile.user_id + '/setting/blacklist',
      success: function(data) {
        console.log("SUCCESS: OBTAINED BLACKLIST: ", data);
        that.setState({blacklist: data});
      },
      error: function(err) {console.log("ERROR: COULD NOT GET BLACKLIST", err);}
    });
  }

  postBlacklist() {
    $.ajax({
      type: 'POST',
      url: '/api/users/' + this.state.profile.user_id + '/setting/blacklist',
      contentType: 'application/json',
      data: JSON.stringify({url: req.body.url, blacklist_type: req.body.blacklist_type, blacklist_time: req.body.blacklist_time, SettingId: SettingId}),
      success: function(data) {console.log("SUCCESS: POSTED BLACKLIST: ", data);},
      error: function(err) {console.log("ERROR: COULD NOT POST BLACKLIST", err);}
    });
  }

  deleteBlacklist(url_id) {
    $.ajax({
      type: 'DELETE',
      url: '/api/users/' + this.state.profile.user_id + '/setting/blacklist/' + url_id,
      success: function(data) {
        console.log("Sucessfully deleted", data);
      },
      error: function(err) {console.log("Error deleting", err);}
    });
  }

  getUserId() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: 'api/users/' + this.state.profile.user_id,
      success: function (data) {
        console.log("SUCCESS: GOT USERID", data.data[0].id);
        that.setState({userId: data.data[0].id});
      },
      error: function (err) {
        console.log('ERROR: COULD NOT GET USERID', err);
      }
    });
  }

  render() {
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
            <tr>
              <td>www.facebook.com</td>
              <td>Blackout</td>
              <td>N/A</td>
            </tr>
          </tbody>

        </Table>
        <br />
        <Row>
          <Input s={6} label="Add Site" />
          <Input s={3} type='select' label="Type" defaultValue='1'>
            <option value='1'>Blackout</option>
            <option value='2'>Block after exceeding</option>
            <option value='3'>Warn after exceeding</option>
          </Input>
          <Input s={3} label="Time Limit (min)" />
        </Row>
        <h3> Personalization: </h3>
        <Row>
        <Input s={12} label="Image" />
        </Row>
        <Row>
        <Input s={12} label="Quote" />
        </Row>
        <Row>
        <Input s={2} type='select' label="Reminder Type" defaultValue='1'>
          <option value='1'>No Reminder</option>
          <option value='2'>Text</option>
          <option value='3'>Email</option>
        </Input>
        <Input s={8} label="Number/Email Address" />
        <Input s={2} type='select' label="Frequency" defaultValue='1'>
          <option value='1'>Daily</option>
          <option value='2'>Weekly</option>
        </Input>
        </Row>
        <h3> Chrome Extension: </h3>
        Forgot to download the extension? Download it here: ___________
      </div>
    );
  }
}
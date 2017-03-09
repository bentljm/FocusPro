import React from 'react';
import getUserAjax from '../utils/UsersUtil';
import { getSettingAjax } from '../utils/SettingsUtil';
// export const Sidebar =({auth})=>(

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.auth.getProfile(),
      username: '',
      picture: '',
    };
    // listen to profile_updated events to update internal state
    this.props.auth.event.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile }, () => {
        this.getUserInfo();
      });
    });
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    getUserAjax(this.state.profile.user_id, (data)=>{
      this.setState({
        username: data.data[0].username || this.state.profile.nickname,
      });
    });
    getSettingAjax(this.state.profile.user_id, (data) => {
      this.setState({
        picture: data.picture || this.state.profile.picture,
      });
    });
  }

  render() {
    return (
      <header>
        <nav className="top-nav full hide-on-large-only"> 
          <a href="#" data-activates="slide-out" className="button-collapse top-nav full hide-on-large-only">
            <i className="material-icons">menu</i>
          </a>
        </nav>

        <ul id="slide-out" className="side-nav fixed theme-color">
          {localStorage.profile && <li><div className="userView">
            <div><img className="circle" src={this.state.picture} alt="auth0" /></div>
            <div><span className="name">{this.state.username}</span></div>
            <div><span className="email">{this.state.profile.email}</span></div>
            <a href="#" className="btn" onClick={this.props.auth.logout}>Log Out</a>
          </div></li>}

          <li>
            {!localStorage.id_token && <a href="#" className="btn login" onClick={this.props.auth.login}>Log In</a>}
          </li>
          {localStorage.id_token && <li><div className="divider" /></li>}
          {localStorage.id_token && <li><a href="#/dashboard" className="waves-effect"><i className="material-icons icon-white">dashboard</i>Dashboard</a></li>}
          {localStorage.id_token && <li><a href="#/settings" className="waves-effect"><i className="material-icons icon-white">settings</i>Settings</a></li>}
          {localStorage.id_token && <li><a href="#/selfreflection" className="waves-effect"><i className="material-icons icon-white">perm_identity</i>Self Reflections</a></li>}
        </ul>
      </header>
    );
  }
}

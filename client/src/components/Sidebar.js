import React, { Component} from 'react';
// export const Sidebar =({auth})=>(

export class Sidebar extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      profile: this.props.auth.getProfile()
    };
    // listen to profile_updated events to update internal state
    this.props.auth.event.on('profile_updated',(newProfile)=>{
      this.setState({'profile': newProfile});
    });
  }

  render(){
    return (
      <header>
        <nav className="top-nav full hide-on-large-only"> 
            <a href="#" data-activates="slide-out" className="button-collapse top-nav full hide-on-large-only"><i className="material-icons">menu</i>
            </a>
        </nav>

          <ul id="slide-out" className="side-nav fixed theme-color">
            {localStorage.profile && <li><div className="userView">
              <a href="#"><img className="circle" src={this.state.profile.picture}/></a>
              <a href="#"><span className="name">{this.state.profile.nickname}</span></a>
              <a href="#"><span className="email">{this.state.profile.email}</span></a>
              <a href="#" className="btn" onClick={this.props.auth.logout}>Log Out</a>
            </div></li>}

            <li>
                {!localStorage.id_token && <a href="#" className="btn" onClick={this.props.auth.login}>Log In</a>}
            </li>
            {localStorage.profile && <li><div className="divider"></div></li>}
            {localStorage.profile && <li><a href="#/settings" className="waves-effect"><i className="material-icons icon-white">settings</i>Settings</a></li>}
            {localStorage.profile && <li><a href="#/selfreflection" className="waves-effect"><i className="material-icons icon-white">perm_identity</i>Self Reflections</a></li>}
          </ul>
      </header>
    );
  }
}

// );


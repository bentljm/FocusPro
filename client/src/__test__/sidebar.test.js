import React from 'react';
import renderer from 'react-test-renderer';
import Sidebar from '../components/Sidebar.js';
import { shallow, mount } from 'enzyme';

xdescribe('Given the user is logged in, Sidebar', () => {
  let sidebar;

  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
    window.localStorage = { //see authService.test for proper localStorage setup
     id_token: true,
     profile: true
    };
    sidebar = shallow(
      <Sidebar auth={auth} />
    );
  });

  afterAll(() => {
     window.localStorage = {};
  });

  it('renders the navbar', () => {
    expect(sidebar.find('.top-nav a')).toHaveLength(1);
  });

  it('does not render the login button', () => {
    sidebar.find('a').forEach((node)=> {
      expect(node.text()).not.toEqual('Log In');
    });
  });

  it('renders the logout, settings, selfreflections and menu button', () => {
    var verifiedObj={};
    sidebar.find('a').forEach((node)=> {
      verifiedObj[node.text()] = verifiedObj[node.text()]+1 ||1;
    });
    expect(verifiedObj['Log Out']).toEqual(1);
    expect(verifiedObj['settingsSettings']).toEqual(1);
    expect(verifiedObj['perm_identitySelf Reflections']).toEqual(1);
    expect(verifiedObj['menu']).toEqual(1);
  });
});

xdescribe('Given the user is NOT logged in, Sidebar', () => {
  let sidebar;

  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
    window.localStorage = {
     id_token: false,
     profile: false
    };
    sidebar = shallow(
      <Sidebar auth={auth} />
    );
  });

  afterAll(() => {
     window.localStorage = {};
  });

  it('renders the navbar', () => {
    expect(sidebar.find('.top-nav a')).toHaveLength(1);
  });

  it('does not render the logout, settings, selfreflections button', () => {
    var verifiedObj={};
    sidebar.find('a').forEach((node)=> {
      verifiedObj[node.text()] = verifiedObj[node.text()]+1 ||1;
    });
    expect(verifiedObj['Log Out']).toBeFalsy();
    expect(verifiedObj['settingsSettings']).toBeFalsy();
    expect(verifiedObj['perm_identitySelf Reflections']).toBeFalsy();
  });

  it('renders the login and menu button', () => {
    var verifiedObj={};
    sidebar.find('a').forEach((node)=> {
      verifiedObj[node.text()] = verifiedObj[node.text()]+1 ||1;
    });
    expect(verifiedObj['Log In']).toEqual(1);
    expect(verifiedObj['menu']).toEqual(1);
  });
});
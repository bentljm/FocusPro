import React from 'react';
import App from '../components/App.js';
import Sidebar from '../components/Sidebar.js';
import { shallow, mount } from 'enzyme';
import {Col} from 'react-materialize';

describe('App', ()=>{
  it('renders without crashing', ()=>{
    var route = {auth: 'dummy'};
    shallow(<App route={route}/>);
  });
  it('renders main section inside a materializeCSS grid column', ()=>{
    var route = {auth: 'dummy'};
    const wrapper = shallow(<App route={route}/>);
    expect(wrapper.find(Col).contains(<div className="container" />)).toBeTruthy();
  });
});
import React from 'react';
import App from '../components/App.js';
import Sidebar from '../components/Sidebar.js';
import { shallow, mount } from 'enzyme';

describe('App', ()=>{
  it('renders without crashing', ()=>{
    var route = {auth: 'dummy'};
    shallow(<App route={route}/>);
  });
});
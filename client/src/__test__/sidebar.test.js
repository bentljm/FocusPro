import React from 'react';
import renderer from 'react-test-renderer';
import {Sidebar} from '../components/Sidebar.js';
import { shallow, mount } from 'enzyme';

describe('Sidebar', () => {
  let sidebar;

  beforeAll(() => {
    sidebar = shallow(<Sidebar />);
  });

  // it('Sidebar renders title', () => {
  //   expect(sidebar.find('.page-title').text()).toEqual('FocusPro');
  // });
});

describe('Sidebar (Snapshot)', () => {
  it('Sidebar renders', () => {
    // const component = renderer.create(<Sidebar />);
    // const json = component.toJSON();
    // expect(json).toMatchSnapshot();
  });
});
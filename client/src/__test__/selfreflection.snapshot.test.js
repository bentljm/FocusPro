import React from 'react';
import renderer from 'react-test-renderer';

//children mock need to be defined before parent module import
jest.mock('react-bootstrap-table', () => {
  return {
    BootstrapTable: 'BootstrapTable',
    TableHeaderColumn: 'TableHeaderColumn',
  };
});

jest.mock('../utils/SettingsUtil', () => {
  let date = (new Date()).setHours(0,0,0,0);
  const dummyQues ={
    data: [{
            question: 'What help can you get?',
            answer: 'Get a couch to hold myself accountable',
            updatedAt: date,
          }, {
            question: 'Whats the worst thing that could happen?',
            answer: 'nothing',
            updatedAt: new Date(date.valueOf() - 1000*60*60*24),
    }],
  };
  return {
    getReflectionsAjax: (userId, callback) => {
      callback(dummyQues);
    },
  }
});

import Selfreflection from '../components/Selfreflection.js';


xdescribe('Selfreflection (Snapshot)', () => {
  beforeAll(() => {
    global.auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  afterAll(() => {
    global.auth = null;
  });

  it('Selfreflection renders', () => {
    const component = renderer.create(<Selfreflection auth={auth}/>);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
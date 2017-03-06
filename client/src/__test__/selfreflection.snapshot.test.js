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
  const dummyQues ={
    data: [{
            question: 'What help can you get?',
            answer: 'Get a couch to hold myself accountable',
            updatedAt: '2017-03-05T00:13:39.289Z'
          }, {
            question: 'Whats the worst thing that could happen?',
            answer: 'nothing',
            updatedAt: '2017-03-05T23:19:16.943Z'
    }],
  };
  return {
    getReflectionsAjax: (userId, callback) => {
      callback(dummyQues);
    },
  }
});

import Selfreflection from '../components/Selfreflection.js';

describe('Selfreflection (Snapshot)', () => {
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
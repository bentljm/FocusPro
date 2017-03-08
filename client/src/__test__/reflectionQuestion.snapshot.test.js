import React from 'react';
import renderer from 'react-test-renderer';

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
  const dummyBlacklist ={
    data: [
      {
        url:'facebook.com',
        blacklist_type:1,
        blacklist_time:3,
        updatedAt:'2017-03-08T03:23:46.663Z',
      }
    ]
  };

  const dummyExtension = {
    url: 'facebook.com',
    time_spent: 30,
  };

  return {
    getReflectionsAjax: (userId, callback) => {
      callback(dummyQues);
    },

    getBlacklistAjax: (userId, callback) =>{
      callback(dummyBlacklist);
    },
    getExtensionDataAjax: (blacklist, callback) =>{
      callback(dummyExtension);
    }
  }
});

import ReflectionQuestion from '../components/ReflectionQuestion.js';


describe('ReflectionQuestion (Snapshot)', () => {
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

  it('ReflectionQuestion renders', () => {
    const component = renderer.create(<ReflectionQuestion auth={auth}/>);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
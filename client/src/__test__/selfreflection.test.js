import React from 'react';
import SelfReflection from '../components/Selfreflection.js';
import { shallow, mount } from 'enzyme';

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


describe ('Given the user has answered 2 self-reflection questions', () => {
  let selfreflection; // global var

  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
    selfreflection = shallow(<SelfReflection auth={auth}/>);
  });

  it ('selfreflection page is rendered', () => {
    // console.log('selfreflection', selfreflection.find('BootstrapTable'));
    expect(selfreflection.find('BootstrapTable')).toHaveLength(1);;
  });

  it ('selfreflection page displays 2 pairs of reflection Q&A', () => {
    selfreflection.instance().getReflections(); // to get access to func
    selfreflection.update(); //update render tree
    console.log(selfreflection.state(['reflections']));
  });

  it ('selfreflection page desc sorts by date on users first click on Date heading')
});
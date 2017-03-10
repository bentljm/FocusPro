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

global.data = [{
            question: 'What help can you get?',
            answer: 'Get a couch to hold myself accountable',
            updatedAt: '2017-03-05T00:13:39.289Z'
          }, {
            question: 'Whats the worst thing that could happen?',
            answer: 'nothing',
            updatedAt: '2017-03-05T23:19:16.943Z'
    }];

xdescribe ('Given the user has answered 2 self-reflection questions', () => {
  let selfreflection; // global var
  let selfreflectionMounted;

  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
    selfreflection = shallow(<SelfReflection auth={auth}/>);
    selfreflectionMounted = mount(<SelfReflection auth={auth}/>);
  });

  it ('selfreflection page is rendered', () => {
    // console.log('selfreflection', selfreflection.find('BootstrapTable'));
    expect(selfreflection.find('BootstrapTable')).toHaveLength(1);;
  });

  it ('selfreflection page displays 2 pairs of reflection Q&A', () => {
    selfreflection.instance().getReflections(); // to get access to func
    selfreflection.update(); //update render tree
    expect(selfreflection.state(['reflections'])).toHaveLength(2);

    // To verify the data is rendered in the table..  may need to use mount..
    const bootstraptable = selfreflectionMounted.find('BootstrapTable').first();
    bootstraptable.find('.react-bs-container-body tbody').forEach(tr => {
      tr.forEach(td=>{
        expect(td.text().includes(`${data[0].question}`));
        expect(td.text().includes(`${data[0].answer}`));
        expect(td.text().includes(`${data[1].question}`));
        expect(td.text().includes(`${data[1].answer}`));

      });
    });
  });

  it ('selfreflection page desc sorts by date on users first click on Date heading')
});
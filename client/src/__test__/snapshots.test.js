import React from 'react';
import renderer from 'react-test-renderer';
import App from '../components/App.js';
import Landingpage from '../components/Landingpage.js';
import Dashboard from '../components/Dashboard.js';
import Goal from '../components/Goal.js'
import Subgoal from '../components/Subgoal.js'
import Selfreflection from '../components/Selfreflection.js';
import Settings from '../components/Settings.js';

describe('App (Snapshot)', () => {
  it('App renders', () => {
    //remove this test. children not rendered, pointless
    var route = {auth: 'dummy'};
    // const component = renderer.create(<App route={route}/>);
    // const json = component.toJSON();
    // expect(json).toMatchSnapshot();
  });
});

describe('Landingpage (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Landingpage renders', () => {
    const component = renderer.create(<Landingpage />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Dashboard (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Dashboard renders', () => {
    const component = renderer.create(<Dashboard />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Goal (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Goal renders', () => {
    const component = renderer.create(<Goal />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Subgoal (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Subgoal renders', () => {
    const component = renderer.create(<Subgoal />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Selfreflection (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Selfreflection renders', () => {
    const component = renderer.create(<Selfreflection />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Settings (Snapshot)', () => {
  beforeAll(() => {
    const auth = {
      getProfile: ()=>'dummy',
      'event': {
        on : ()=>'dummy event listener'
      }
    };
  });

  it('Settings renders', () => {
    const component = renderer.create(<Settings />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});



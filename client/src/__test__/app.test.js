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
    // const component = renderer.create(<App />);
    // const json = component.toJSON();
    // expect(json).toMatchSnapshot();
  });
});

describe('Landingpage (Snapshot)', () => {
  it('Landingpage renders', () => {
    const component = renderer.create(<Landingpage />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Dashboard (Snapshot)', () => {
  it('Dashboard renders', () => {
    const component = renderer.create(<Dashboard />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Goal (Snapshot)', () => {
  it('Goal renders', () => {
    const component = renderer.create(<Goal />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Subgoal (Snapshot)', () => {
  it('Subgoal renders', () => {
    const component = renderer.create(<Subgoal />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Selfreflection (Snapshot)', () => {
  it('Selfreflection renders', () => {
    const component = renderer.create(<Selfreflection />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

describe('Settings (Snapshot)', () => {
  it('Settings renders', () => {
    const component = renderer.create(<Settings />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});



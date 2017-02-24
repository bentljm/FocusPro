import React from 'react';
import {} from 'react-materialize';

export default class Site extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        Image of line chart goes here. Along with whatever text for {this.props.url}
      </div>
    );
  }
}
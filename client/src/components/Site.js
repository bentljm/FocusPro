import React from 'react';
import { Surface, Pie } from 'recharts';

export default class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: 'iphone4', value: 120, fill: '#ff7300' },
        { name: 'iphone4s', value: 500, fill: '#e5671a' },
        { name: 'iphone5', value: 600, fill: '#907213' },
      ],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData() {
    this.setState = {
      // data.labels = this.props.url;
      // data.datasets[0].data = this.props.data
    };
  }

  render() {
    return (
      <Surface width={400} height={200}>
        <Pie
          startAngle={360}
          endAngle={0}
          cx={100}
          cy={100}
          outerRadius={80}
          innerRadius={0}
          data={this.state.data}
          paddingAngle={0}
        />
      </Surface>
    );
  }
}

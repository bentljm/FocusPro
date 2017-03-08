import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, linearGradient, Tooltip } from 'recharts';

export default class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { date: 'Feb 26', time: 4 },
        { date: 'Feb 27', time: 6 },
        { date: 'Feb 28', time: 9 },
        { date: 'Feb 29', time: 12 },
        { date: 'Mar 1', time: 20 },
        { date: 'Mar 2', time: 50 },
        { date: 'Mar 3', time: 100 },
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
      <AreaChart width={650} height={250} data={this.state.data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0">
            <stop stopColor="#0088FE" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="time" stroke="#0088FE" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    );
  }
}

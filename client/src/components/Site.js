import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, linearGradient, Tooltip } from 'recharts';

export default class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.historyData();
  }

  historyData() {
    const that = this;
    const site = this.props.siteInfo(this.props.url);
    let data = [];
    let curr = 0;
    if(site.history) {
      console.log('hello');
      for (let i = 0; i < site.history.length; i++) {
        const ms = parseInt(site.history[i][0], 10);
        let date = new Date(ms).toLocaleDateString();
        const year = new Date(ms).getFullYear();
        date = date.toString().replace(`/${year}`, '');
        const time = parseInt(site.history[i][1], 10) - curr;
        curr = parseInt(site.history[i][1], 10);
        data.push({date: date, time: time});
      }
    }
    that.setState({data: data});
  }

  render() {
    let chart = <span> Sorry, there is currently no data to be displayed. Data is collected daily at midnight. </span>;
    if (this.state.data.length > 0) {
      chart = <AreaChart width={650} height={250} data={this.state.data}>
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
      </AreaChart>;
    }
    return (
      <div>
      {chart}
      </div>
    );
  }
}

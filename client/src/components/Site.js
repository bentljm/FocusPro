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
    let curr = 0;
    const historyData = [];
    if (site.history) {
      for (let i = 0; i < site.history.length; i++) {
        const ms = parseInt(site.history[i][0], 10);
        let displayDate = new Date(ms).toLocaleDateString();
        const year = new Date(ms).getFullYear();
        displayDate = displayDate.toString().replace(`/${year}`, '');
        const displayTime = parseInt(site.history[i][1], 10) - curr;
        curr = parseInt(site.history[i][1], 10);
        historyData.push({ date: displayDate, time: displayTime });
      }
    }
    that.setState({ data: historyData });
  }

  render() {
    let chart = <span> Sorry, there is currently no data to be displayed. Data is collected daily at midnight. </span>;
    if (this.state.data.length > 0) {
      chart = (<AreaChart width={250} height={250} data={this.state.data}>
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
      </AreaChart>);
    }
    return (
      <div>
        {chart}
      </div>
    );
  }
}

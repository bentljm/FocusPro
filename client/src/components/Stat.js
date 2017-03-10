import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';

export default class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getExtensionData();
  }

  getExtensionData() {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const that = this;
    $.ajax({
      type: 'GET',
      url: `/api/users/${this.props.profile.user_id}/extension_data`,
      success: (data) => {
        // Get data into useable form
        let pieData = [];
        for (let i = 0; i < data.data.length; i++) {
          pieData.push({ name: data.data[i].url, value: Math.round(data.data[i].time_spent / 60), unit: 'min' });
        }
        // Sort the data
        pieData.sort((a, b) => b.value - a.value);
        const max = 10;
        // Only show max number of sites
        pieData = pieData.slice(0, max);
        // Add color
        for (let j = 0; j < pieData.length; j++) {
          pieData[j].fill = colors[j % colors.length];
        }
        that.setState({ data: pieData });
      },
      error: (err) => { console.log('ERROR: COULD NOT GET EXTENSION DATA', err); },
    });
  }

  render() {
    return (
      <PieChart width={200} height={200}>
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
        <Tooltip />
      </PieChart>
    );
  }
}

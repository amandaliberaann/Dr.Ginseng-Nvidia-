import { MinusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';

import lineChart from './configs/lineChart';
import './style.css';

function LineChart() {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Active Users</Title>
          <Paragraph className="lastweek">
            than last week <span className="bnb2">+30%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Traffic</li>
            <li>{<MinusOutlined />} Sales</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        height={300}
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        width={'100%'}
      />
    </>
  );
}

export default LineChart;

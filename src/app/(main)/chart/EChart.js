import { Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';

import eChart from './configs/eChart';
import './style.css';

function EChart({ data, title, isWeek, isDay }) {
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
      </div>

      <ReactApexChart
        className="full-width"
        height={300}
        options={eChart.options}
        series={eChart.series}
        type="bar"
      />
    </>
  );
}

export default EChart;

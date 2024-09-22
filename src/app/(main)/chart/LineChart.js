import { MinusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import lineChart from './configs/lineChart';
import './style.css';

const sortDataByMonth = (data) => {
  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return monthOrder.map((month) => data[month]);
};
function LineChart({ data, title }) {
  const { Title, Paragraph } = Typography;
  const [series, setSeries] = useState(lineChart.series);
  const [mobileData, setMobileData] = useState([]);
  const [webSiteData, setWebSiteData] = useState([]);

  useEffect(() => {
    if (data) {
      console.log('Data in Line Chart:', data);
      setMobileData(sortDataByMonth(data)); // Assuming sortDataByMonth is correctly implemented
      setWebSiteData(sortDataByMonth(data)); // Adjust accordingly if different data is needed
    }
  }, [data]); // This will only run when `data` changes

  // Second useEffect to handle updating the series
  useEffect(() => {
    setSeries([
      { data: mobileData, name: 'Mobile apps', offsetY: 0 },
      { data: webSiteData, name: 'Websites', offsetY: 0 },
    ]);
  }, [mobileData, webSiteData]); //

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>{title}</Title>
          {/* <Paragraph className="lastweek">
            than last week <span className="bnb2">+30%</span>
          </Paragraph> */}
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Daily Activity</li>
            <li>
              {<MinusOutlined />} {title}
            </li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        height={300}
        options={lineChart.options}
        series={series}
        type="area"
        width={'100%'}
      />
    </>
  );
}

export default LineChart;

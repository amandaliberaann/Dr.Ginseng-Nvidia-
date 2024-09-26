import { MinusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import lineChart from './configs/lineChart';
import './style.css';

const dayCategories = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const weekCategories = ['Week1', 'Week2', 'Week3', 'Week4'];

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
const sortDataByDay = (data) => {
  const weekOrder = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  return weekOrder.map((day) => data[day]);
};
const sortDataByWeek = (data) => {
  const weekOrder = ['Week1', 'Week2', 'Week3', 'Week4'];
  return weekOrder.map((day) => data[day]);
};
function LineChart({ data, title, isWeek, isDay }) {
  const { Title, Paragraph } = Typography;
  const [series, setSeries] = useState(lineChart.series);
  const [mobileData, setMobileData] = useState([]);
  const [webSiteData, setWebSiteData] = useState([]);

  useEffect(() => {
    if (data) {
      console.log('Data in Line Chart:', data);

      if (isDay) {
        setMobileData(sortDataByDay(data)); // 按天排序数据
        setWebSiteData(sortDataByDay(data)); // 按天排序数据
      } else if (isWeek) {
        setMobileData(sortDataByWeek(data)); // 按周排序数据
        setWebSiteData(sortDataByWeek(data)); // 按周排序数据
      } else {
        setMobileData(sortDataByMonth(data)); // 按月排序数据
        setWebSiteData(sortDataByMonth(data)); // 按月排序数据
      }
    }
  }, [data]); // This will only run when `data` changes
  const options = {
    chart: {
      height: 350,
      toolbar: {
        show: false,
      },
      type: 'area',
      width: '100%',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    xaxis: {
      categories: isWeek
        ? weekCategories
        : isDay
          ? dayCategories
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // 默认使用月份
      labels: {
        colors: ['#8c8c8c'],
        fontSize: '12px',
        fontWeight: 300,
      },
    },
    yaxis: {
      labels: {
        colors: ['#8c8c8c'],
        fontSize: '12px',
        fontWeight: 300,
      },
    },
  };
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
        // options={lineChart.options}
        options={options}
        series={series}
        type="area"
        width={'100%'}
      />
    </>
  );
}

export default LineChart;

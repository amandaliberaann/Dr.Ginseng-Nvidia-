const lineChart = {
  options: {
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
      categories: [
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
      ],
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
  },
  series: [
    {
      data: [350, 40, 300, 220, 500, 250, 400, 230, 500, 350, 40, 300],
      name: 'Mobile apps',
      offsetY: 0,
    },
    {
      data: [30, 90, 40, 140, 290, 290, 340, 230, 400, 30, 90, 40],
      name: 'Websites',
      offsetY: 0,
    },
  ],
};

export default lineChart;

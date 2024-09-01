const eChart = {
  options: {
    chart: {
      height: 'auto',
      toolbar: {
        show: false,
      },
      type: 'bar',
      width: '100%',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#ccc',
      show: true,
      strokeDashArray: 2,
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '70%',
        horizontal: false,
      },
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' thousands';
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
        align: 'right',
        colors: ['#8c8c8c'],
        fontSize: '12px',
        fontWeight: 300,
        maxWidth: 160,
        minWidth: 0,
        show: true,
      },
    },
    yaxis: {
      labels: {
        align: 'right',
        colors: ['#8c8c8c'],
        fontSize: '12px',
        fontWeight: 300,
        maxWidth: 160,
        minWidth: 0,
        show: true,
      },
    },
  },
  series: [
    {
      color: 'bnb2',
      data: [450, 200, 100, 220, 500, 100, 400, 230, 500, 450, 200, 100],
      name: 'Sales',
    },
  ],
};

export default eChart;

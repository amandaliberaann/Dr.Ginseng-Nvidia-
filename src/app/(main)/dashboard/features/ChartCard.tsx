import { Card } from 'antd';
import { createStyles } from 'antd-style';
import dynamic from 'next/dynamic';
import { memo } from 'react';

// Define a mapping object that links chart types to their corresponding dynamically imported components
const chartComponentsMap = {
  EChart: dynamic(() => import('@/app/(main)/chart/EChart'), { ssr: false }),
  LineChart: dynamic(() => import('@/app/(main)/chart/LineChart'), { ssr: false }),
  // Additional chart components can be added here in the future
  // BarChart: dynamic(() => import('@/app/(main)/chart/BarChart'), { ssr: false }),
  // PieChart: dynamic(() => import('@/app/(main)/chart/PieChart'), { ssr: false }),
};

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 100%;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary}
      inset;
    transition: box-shadow 0.2s ${token.motionEaseInOut};
    &:hover {
      box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillSecondary : token.colorFill} inset;
    }
  `,
  inner: css`
    padding: 0px;
    margin-bottom: 0px;
  `,
}));

interface ChartCardProps {
  chartType: keyof typeof chartComponentsMap; // chartType must be a key of chartComponentsMap
  data?: any; // You can specify a more precise type based on your data structure
  isDay?: boolean;
  isWeek?: boolean;
  title?: string;
}

const ChartCard = memo<ChartCardProps>(({ chartType, data, title, isWeek, isDay }) => {
  const { styles } = useStyles();
  const ChartComponent = chartComponentsMap[chartType]; // Dynamically select the chart component based on chartType

  return (
    <Card className={styles.inner}>
      <ChartComponent data={data} isDay={isDay} isWeek={isWeek} title={title} />
    </Card>
  );
});

ChartCard.displayName = 'ChartCard';

export default ChartCard;

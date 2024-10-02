'use client';

import { useUser } from '@clerk/nextjs';
import { Grid } from '@lobehub/ui';
import { Button, Flex } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import TimeSwitch from '@/features/TimeToggle/TimeSwitch';

import ChartCard from './ChartCard';

const useStyles = createStyles(({ css, responsive }) => ({
  title: css`
    margin-block-start: 0.5em;
    font-size: 24px;
    font-weight: 600;
    ${responsive.mobile} {
      font-size: 20px;
    }
  `,
}));
interface MonthlyData {
  Apr: number;
  Aug: number;
  Dec: number;
  Feb: number;
  Jan: number;
  Jul: number;
  Jun: number;
  Mar: number;
  May: number;
  Nov: number;
  Oct: number;
  Sep: number;
}
type SelectedDates = {
  month: string | null;
  week: string | null;
  year: string | null;
};
interface ActivityData {
  calories: MonthlyData;
  distance: MonthlyData;
  lightlyActiveMinutes: MonthlyData;
  minutesAsleep: MonthlyData;
  minutesAwake: MonthlyData;
  moderatelyActiveMinutes: MonthlyData;
  sedentaryMinutes: MonthlyData;
  steps: MonthlyData;
  timeInBed: MonthlyData;
  veryActiveMinutes: MonthlyData;
}
const ChartList = memo(() => {
  //获取activity数据:steps,distance,calories
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isWeek, setIsWeek] = useState(false);
  const [isDay, setIsDay] = useState(false);
  const { t } = useTranslation('dashboard');
  //Get Logged In user
  const { user } = useUser();
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    month: null,
    week: null,
    year: null,
  });

  // 获取选择的时间
  const handleDateChange = (
    type: keyof SelectedDates,
    date: any,
    dateString: string | string[],
  ): void => {
    const formattedDateString = Array.isArray(dateString) ? dateString.join(', ') : dateString;

    setSelectedDates((prevDates) => {
      const updatedDates = {
        ...prevDates,
        [type]: formattedDateString, // 处理后的 dateString
      };

      // 检查 week 是否存在
      if (updatedDates.week) {
        setIsDay(true);
      } else {
        setIsDay(false); // 重置为 false，如果 week 为空
      }

      // 检查 month 是否存在
      if (updatedDates.month) {
        setIsWeek(true);
      } else {
        setIsWeek(false); // 重置为 false，如果 month 为空
      }

      return updatedDates;
    });
  };

  //打印 userId
  console.log('ChartList', user?.id);
  //查看selectedDates
  console.log('SelectedDates', selectedDates);
  const handleSubmit = async () => {
    // 获取用户 ID，假设已经有用户信息

    let url = `/api/activity?userId=${user?.id}`;

    // 根据传递的 year, month, week 动态构造 URL
    if (selectedDates.week) {
      url += `&week=${selectedDates.week}`;
    }
    if (selectedDates.month) {
      url += `&month=${selectedDates.month}`;
    }
    if (selectedDates.year) {
      url += `&year=${selectedDates.year}`;
    }
    if (user?.id) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('data', data);
        setActivityData(data);
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      }
      // 错误处理
    }
  };
  //页面首次加载
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/activity?userId=${user.id}`);
          const data = await response.json();
          console.log('data', data);
          setActivityData(data);
        } catch (error) {
          console.error('Failed to fetch activity data:', error);
          // Even if you don't need to handle errors in the UI,
          // it's still a good practice to handle them in some way,
          // at least logging them as done here.
        }
        clearInterval(interval); // Stop polling once user data is loaded
      }
    }, 3000);
  }, [user]); // Dependency on user state

  const { styles } = useStyles();
  return (
    <Flexbox direction="vertical" gap={16}>
      <h2 className={styles.title}>{t(`title.summary`)}</h2>
      {/* Section for Summary */}
      <Grid rows={1}>
        <ChartCard chartType="EChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.activity')}</h2>
      {/* Section for Activity */}
      <Flex gap="small">
        <TimeSwitch onDateChange={handleDateChange} />
        <Button onClick={handleSubmit} type="primary">
          Go
        </Button>
      </Flex>

      <Grid rows={2}>
        <ChartCard
          chartType="LineChart"
          data={activityData?.calories}
          isDay={isDay}
          isWeek={isWeek}
          title="Calories"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.distance}
          isDay={isDay}
          isWeek={isWeek}
          title="Distance (km)"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.steps}
          isDay={isDay}
          isWeek={isWeek}
          title="Steps"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.sedentaryMinutes}
          isDay={isDay}
          isWeek={isWeek}
          title="Sendentary time (minutes)"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.lightlyActiveMinutes}
          isDay={isDay}
          isWeek={isWeek}
          title="Light Active time (minutes)"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.moderatelyActiveMinutes}
          isDay={isDay}
          isWeek={isWeek}
          title="Moderately Active time (minutes)"
        />

        <ChartCard
          chartType="LineChart"
          data={activityData?.veryActiveMinutes}
          isDay={isDay}
          isWeek={isWeek}
          title="Active time (minutes)"
        />
      </Grid>
      <h2 className={styles.title}>{t('title.sleep')}</h2>

      {/* Section for Sleep */}
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      <Grid rows={2}>
        <ChartCard
          chartType="LineChart"
          data={activityData?.minutesAsleep}
          isDay={isDay}
          isWeek={isWeek}
          title="Minutes Asleep"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.minutesAwake}
          isDay={isDay}
          isWeek={isWeek}
          title="Minutes Awake"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.timeInBed}
          isDay={isDay}
          isWeek={isWeek}
          title="Time in Bed"
        />
      </Grid>

      <h2 className={styles.title}>{t('title.bodyMeasurements')}</h2>
      {/* Section for Body Measurements */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.cycleTracking')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Cycle Tracking */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.nutrition')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Nutrition */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.repiratory')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.medications')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.hearing')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.symptoms')}</h2>
      {/* <Flex gap="small"> */}
      {/* <TimeSwitch onDateChange={handleDateChange} /> */}
      {/* <Button onClick={handleSubmit} type="primary">
          Go
        </Button> */}
      {/* </Flex> */}
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>
    </Flexbox>
  );
});

ChartList.displayName = 'ChartList';

export default ChartList;

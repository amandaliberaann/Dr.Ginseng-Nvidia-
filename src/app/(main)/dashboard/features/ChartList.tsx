'use client';

import { useUser } from '@clerk/nextjs';
import { Grid } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

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
  //获取每日activity数据:steps,distance,calories
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const { t } = useTranslation('dashboard');
  //Get Logged In user
  const { user } = useUser();

  //获取userId
  console.log('ChartList', user?.id);
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
      <Grid rows={2}>
        <ChartCard chartType="LineChart" data={activityData?.calories} title="Calories" />
        <ChartCard chartType="LineChart" data={activityData?.distance} title="Distance (km)" />
        <ChartCard chartType="LineChart" data={activityData?.steps} title="Steps" />
        <ChartCard
          chartType="LineChart"
          data={activityData?.sedentaryMinutes}
          title="Sendentary time (minutes)"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.lightlyActiveMinutes}
          title="Light Active time (minutes)"
        />
        <ChartCard
          chartType="LineChart"
          data={activityData?.moderatelyActiveMinutes}
          title="Moderately Active time (minutes)"
        />

        <ChartCard
          chartType="LineChart"
          data={activityData?.veryActiveMinutes}
          title="Active time (minutes)"
        />
      </Grid>
      <h2 className={styles.title}>{t('title.sleep')}</h2>
      {/* Section for Sleep */}
      <Grid rows={2}>
        <ChartCard
          chartType="LineChart"
          data={activityData?.minutesAsleep}
          title="Minutes Asleep"
        />
        <ChartCard chartType="LineChart" data={activityData?.minutesAwake} title="Minutes Awake" />
        <ChartCard chartType="LineChart" data={activityData?.timeInBed} title="Time in Bed" />
      </Grid>

      <h2 className={styles.title}>{t('title.bodyMeasurements')}</h2>
      {/* Section for Body Measurements */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.cycleTracking')}</h2>
      {/* Section for Cycle Tracking */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.nutrition')}</h2>
      {/* Section for Nutrition */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.repiratory')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.medications')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.hearing')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.symptoms')}</h2>
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

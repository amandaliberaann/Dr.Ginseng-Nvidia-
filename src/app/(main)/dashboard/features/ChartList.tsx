'use client';

import { Grid } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';
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

const ChartList = memo(() => {
  const { t } = useTranslation('dashboard');
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
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.bodyMeasurements')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.cycleTracking')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.sleep')}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
        <ChartCard chartType="LineChart" />
      </Grid>

      <h2 className={styles.title}>{t('title.nutrition')}</h2>
      {/* Section for Activity */}
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

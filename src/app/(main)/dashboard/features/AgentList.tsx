'use client';

import { Grid } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import AgentCard from './AgentCard';

const AgentList = memo(() => {
  const { t } = useTranslation('dashboard');

  return (
    <Flexbox direction="vertical" gap={16}>
      {/* Section for Summary */}
      <h2>{t('title.summary')}</h2>
      <Grid rows={1}>
        <AgentCard chartType="EChart" title={t('title.summary')} />
      </Grid>

      {/* Section for Activity */}
      <h2>{t('title.activity')}</h2>
      <Grid rows={1}>
        <AgentCard chartType="LineChart" title={t('title.activity')} />
      </Grid>
    </Flexbox>
  );
});

AgentList.displayName = 'AgentList';

export default AgentList;
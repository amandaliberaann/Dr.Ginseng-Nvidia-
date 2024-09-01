'use client';

import { Grid } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import AgentCard from './AgentCard';
import { useTranslation } from 'react-i18next';

const AgentList = memo(() => {
  const { t } = useTranslation('dashboard');

  return (
    <Flexbox direction="vertical" gap={16}>
      <h2>{t(`title.summary`)}</h2>
      {/* Section for Summary */}
      <Grid rows={2}>
        {/* <AgentCard chartType="EChart" title={t('title.summary')} /> */}
        <AgentCard chartType="EChart"/>
        <AgentCard chartType="LineChart"/>
        <AgentCard chartType="LineChart"/>
      </Grid>

      <h2>{t("title.activity")}</h2>
      {/* Section for Activity */}
      <Grid rows={2}>
        <AgentCard chartType="LineChart"/>
        <AgentCard chartType="LineChart"/>
        <AgentCard chartType="LineChart"/>
      </Grid>
    </Flexbox>
  );
});

AgentList.displayName = 'AgentList';

export default AgentList;

'use client';

import { Grid, SpotlightCardProps } from '@lobehub/ui';
import { Empty, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoad from 'react-lazy-load';

import { useMarketStore } from '@/store/market';

import MedicalCard from './MedicalCard';

const useStyles = createStyles(({ css, responsive }) => ({
  compactLazy: css`
    min-height: 120px;
  `,
  lazy: css`
    min-height: 332px;
  `,
  title: css`
    margin-block-start: 0.5em;
    font-size: 24px;
    font-weight: 600;
    ${responsive.mobile} {
      font-size: 20px;
    }
  `,
}));

export interface MedicalListProps {
  mobile?: boolean;
}

const MedicalList = memo<MedicalListProps>(({ mobile }) => {
  const { t } = useTranslation('query');
  const [searchKeywords, useFetchAgentList] = useMarketStore((s) => [
    s.searchKeywords,
    s.useFetchAgentList,
  ]);
  const { isLoading } = useFetchAgentList();
  //   const agentList = useMarketStore(agentMarketSelectors.getAgentList, isEqual);
  const { styles } = useStyles();
  const recentLength = mobile ? 3 : 6;

  // change all cards to arrays
  const chineseMedicineBasicsArray = Object.values(
    t('chineseMedicineBasics.cards', { returnObjects: true }),
  );
  const constitutionHealthTipsArray = Object.values(
    t('constitutionHealthTips.cards', { returnObjects: true }),
  );
  const diseasePreventionArray = Object.values(
    t('diseasePrevention.cards', { returnObjects: true }),
  );
  const functionalHealthArray = Object.values(t('functionalHealth.cards', { returnObjects: true }));
  const seasonalHealthTipsArray = Object.values(
    t('seasonalHealthTips.cards', { returnObjects: true }),
  );

  // combine all arrays
  const medicalList = [
    ...chineseMedicineBasicsArray,
    ...constitutionHealthTipsArray,
    ...diseasePreventionArray,
    ...functionalHealthArray,
    ...seasonalHealthTipsArray,
  ];

  useLayoutEffect(() => {
    // refs: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#hashydrated
    useMarketStore.persist.rehydrate();
  }, []);

  const GridCompactRender: SpotlightCardProps['renderItem'] = useCallback(
    (props: any) => (
      <LazyLoad className={styles.compactLazy} offset={332}>
        <MedicalCard variant={'compact'} {...props} />
      </LazyLoad>
    ),
    [],
  );

  if (isLoading || (!searchKeywords && medicalList?.length === 0)) {
    return (
      <>
        <h2 className={styles.title}>{t('chineseMedicineBasics.title')}</h2>
        <Skeleton paragraph={{ rows: 8 }} title={false} />
        <h2 className={styles.title}>{t('constitutionHealthTips.title')}</h2>
        <Skeleton paragraph={{ rows: 8 }} title={false} />
        <h2 className={styles.title}>{t('diseasePrevention.title')}</h2>
        <Skeleton paragraph={{ rows: 8 }} title={false} />
        <h2 className={styles.title}>{t('functionalHealth.title')}</h2>
        <Skeleton paragraph={{ rows: 8 }} title={false} />
        <h2 className={styles.title}>{t('seasonalHealthTips.title')}</h2>
        <Skeleton paragraph={{ rows: 8 }} title={false} />
      </>
    );
  }

  if (searchKeywords) {
    if (medicalList.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return (
      <Grid rows={3}>
        {medicalList.map((item) => (
          <GridCompactRender key={item.identifier} {...item} />
        ))}
      </Grid>
    );
  }

  return (
    <>
      <h2 className={styles.title}>{t('chineseMedicineBasics.title')}</h2>
      <Grid rows={3}>
        {chineseMedicineBasicsArray.slice(0, recentLength).map((item) => (
          <MedicalCard key={item.identifier} {...item} />
        ))}
      </Grid>

      <h2 className={styles.title}>{t('constitutionHealthTips.title')}</h2>
      <Grid rows={3}>
        {constitutionHealthTipsArray.slice(0, recentLength).map((item) => (
          <MedicalCard key={item.identifier} {...item} />
        ))}
      </Grid>

      <h2 className={styles.title}>{t('diseasePrevention.title')}</h2>
      <Grid rows={3}>
        {diseasePreventionArray.slice(0, recentLength).map((item) => (
          <MedicalCard key={item.identifier} {...item} />
        ))}
      </Grid>

      <h2 className={styles.title}>{t('functionalHealth.title')}</h2>
      <Grid rows={3}>
        {functionalHealthArray.slice(0, recentLength).map((item) => (
          <MedicalCard key={item.identifier} {...item} />
        ))}
      </Grid>

      <h2 className={styles.title}>{t('seasonalHealthTips.title')}</h2>
      <Grid rows={3}>
        {seasonalHealthTipsArray.slice(0, recentLength).map((item) => (
          <MedicalCard key={item.identifier} {...item} />
        ))}
      </Grid>
    </>
  );
});

MedicalList.displayName = 'MedicalList';

export default MedicalList;

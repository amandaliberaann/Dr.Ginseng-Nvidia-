'use client';

import { Grid } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useMarketStore } from '@/store/market';

import MedicalCard from './MedicalCard';

// 只在客户端渲染 MedicalDetailContent
const MedicalDetailContent = dynamic(() => import('../@detail/features/MedicalDetailContent'), {
  ssr: false,
});

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
  searchKeywords: string;
  selectedTag: string;
}

const MedicalList = memo<MedicalListProps>(({ mobile, searchKeywords, selectedTag }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const { t } = useTranslation('query');
  const { styles } = useStyles();
  const recentLength = mobile ? 3 : 6;
  const [useFetchAgentList] = useMarketStore((s) => [s.useFetchAgentList]);
  const { isLoading } = useFetchAgentList();
  useLayoutEffect(() => {
    // refs: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#hashydrated
    useMarketStore.persist.rehydrate();
  }, []);

  const handleCardClick = (identifier: string) => {
    // 获取当前的 URL 查询参数
    const params = new URLSearchParams(window.location.search);

    // 设置或更新 agent 参数
    params.set('agent', identifier);

    // 将新的查询参数添加到 URL 中
    router.push(`/query?${params.toString()}`);
  };

  // define filter function
  const filterItems = (items: any[]) => {
    return items.filter((item) => {
      const matchesSearchKeywords =
        !searchKeywords ||
        item.description.toLowerCase().includes(searchKeywords.toLowerCase()) ||
        item.title.toLowerCase().includes(searchKeywords.toLowerCase());

      const matchesSelectedTag = !selectedTag || item.tags.includes(selectedTag);

      return matchesSearchKeywords && matchesSelectedTag;
    });
  };

  // divide data
  const chineseMedicineBasicsArray = filterItems(
    Object.values(t('chineseMedicineBasics.cards', { returnObjects: true })),
  );
  const constitutionHealthTipsArray = filterItems(
    Object.values(t('constitutionHealthTips.cards', { returnObjects: true })),
  );
  const diseasePreventionArray = filterItems(
    Object.values(t('diseasePrevention.cards', { returnObjects: true })),
  );
  const functionalHealthArray = filterItems(
    Object.values(t('functionalHealth.cards', { returnObjects: true })),
  );
  const seasonalHealthTipsArray = filterItems(
    Object.values(t('seasonalHealthTips.cards', { returnObjects: true })),
  );

  if (
    isLoading ||
    (!searchKeywords &&
      !selectedTag &&
      [
        chineseMedicineBasicsArray,
        constitutionHealthTipsArray,
        diseasePreventionArray,
        functionalHealthArray,
        seasonalHealthTipsArray,
      ].every((array) => array?.length === 0))
  ) {
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

  return (
    <>
      {chineseMedicineBasicsArray.length > 0 && (
        <>
          <h2 className={styles.title}>{t('chineseMedicineBasics.title')}</h2>
          <Grid rows={3}>
            {chineseMedicineBasicsArray.slice(0, recentLength).map((item) => (
              <MedicalCard key={item.identifier} {...item} onClick={handleCardClick} />
            ))}
          </Grid>
        </>
      )}

      {constitutionHealthTipsArray.length > 0 && (
        <>
          <h2 className={styles.title}>{t('constitutionHealthTips.title')}</h2>
          <Grid rows={3}>
            {constitutionHealthTipsArray.slice(0, recentLength).map((item) => (
              <MedicalCard key={item.identifier} {...item} onClick={handleCardClick} />
            ))}
          </Grid>
        </>
      )}

      {diseasePreventionArray.length > 0 && (
        <>
          <h2 className={styles.title}>{t('diseasePrevention.title')}</h2>
          <Grid rows={3}>
            {diseasePreventionArray.slice(0, recentLength).map((item) => (
              <MedicalCard key={item.identifier} {...item} onClick={handleCardClick} />
            ))}
          </Grid>
        </>
      )}

      {functionalHealthArray.length > 0 && (
        <>
          <h2 className={styles.title}>{t('functionalHealth.title')}</h2>
          <Grid rows={3}>
            {functionalHealthArray.slice(0, recentLength).map((item) => (
              <MedicalCard key={item.identifier} {...item} onClick={handleCardClick} />
            ))}
          </Grid>
        </>
      )}

      {seasonalHealthTipsArray.length > 0 && (
        <>
          <h2 className={styles.title}>{t('seasonalHealthTips.title')}</h2>
          <Grid rows={3}>
            {seasonalHealthTipsArray.slice(0, recentLength).map((item) => (
              <MedicalCard key={item.identifier} {...item} onClick={handleCardClick} />
            ))}
          </Grid>
        </>
      )}
      {/* If choose any card, it will diplay content on detailsidebar */}
      {identifier && <MedicalDetailContent />}
    </>
  );
});

MedicalList.displayName = 'MedicalList';

export default MedicalList;

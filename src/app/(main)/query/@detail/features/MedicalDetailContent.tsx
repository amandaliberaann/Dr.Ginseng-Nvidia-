'use client';

import { Markdown } from '@lobehub/ui';
import { useSearchParams } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import Banner from '@/app/(main)/market/@detail/features/Banner';

import Header from './Header';
import Loading from './Loading';

export interface MedicalDetailContentProps {
  mobile?: boolean;
}

const MedicalDetailContent = memo<MedicalDetailContentProps>(({ mobile }) => {
  const { t } = useTranslation('query');
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

  const searchParams = useSearchParams();
  const identifier = searchParams.get('agent'); // 使用 'agent' 而不是 'identifier'

  // find according content data by identifier
  const selectedData = medicalList.find((card) => card.identifier === identifier);
  const isLoading = !medicalList || !selectedData || medicalList.length === 0;

  if (isLoading) return <Loading />;

  return (
    <>
      <Banner avatar={selectedData.avatar} mobile={mobile} />
      <Header
        description={selectedData.description}
        tags={selectedData.tags}
        title={selectedData.title}
      />
      <Flexbox style={{ padding: 16 }}>
        <Markdown fullFeaturedCodeBlock variant={'chat'}>
          {selectedData.content}
        </Markdown>
      </Flexbox>
    </>
  );
});

export default MedicalDetailContent;

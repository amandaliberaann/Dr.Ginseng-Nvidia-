import { Flexbox } from 'react-layout-kit';

import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

import AgentSearchBar from './features/AgentSearchBar';
import MedicalList from './features/MedicalList';
import TagList from './features/TagList';

export const generateMetadata = async () => {
  const { t } = await translation('metadata');
  return metadataModule.generate({
    description: t('query.description'),
    title: t('query.title'),
    url: '/query',
  });
};

const Page = async () => {
  const mobile = isMobileDevice();
  const { t } = await translation('metadata');
  const ld = ldModule.generate({
    description: t('query.description'),
    title: t('query.title'),
    url: '/query',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <AgentSearchBar mobile={mobile} />
      <Flexbox gap={mobile ? 16 : 24}>
        <TagList />
        <MedicalList mobile={mobile} />
      </Flexbox>
    </>
  );
};

Page.displayName = 'Query';

export default Page;

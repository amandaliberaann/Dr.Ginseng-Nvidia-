import { Flexbox } from 'react-layout-kit';



import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';



import AgentList from './features/AgentList';


export const generateMetadata = async () => {
  const { t } = await translation('metadata');
  return metadataModule.generate({
    description: t('market.description'),
    title: t('market.title'),
    url: '/query',
  });
};

const Page = async () => {
  const mobile = isMobileDevice();
  const { t } = await translation('metadata');
  const ld = ldModule.generate({
    description: t('market.description'),
    title: t('market.title'),
    url: '/query',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <Flexbox gap={mobile ? 16 : 24}>
        <AgentList mobile={mobile} />
      </Flexbox>
    </>
  );
};

Page.displayName = 'Query';

export default Page;
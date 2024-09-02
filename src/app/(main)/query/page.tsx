import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

import MedicalDashboard from './features/MedicalDashboard';

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
      <MedicalDashboard mobile={mobile} />
    </>
  );
};

Page.displayName = 'Query';

export default Page;

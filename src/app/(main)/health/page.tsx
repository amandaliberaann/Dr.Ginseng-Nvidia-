import { Flexbox } from 'react-layout-kit';

import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

// import ChartList from './features/ChartList';
import HealthForm from './features/HealthForm';

export const generateMetadata = async () => {
  const { t } = await translation('metadata');
  return metadataModule.generate({
    description: t('healthform.description'),
    title: t('healthform.title'),
    url: '/health',
  });
};

const Page = async () => {
  const mobile = isMobileDevice();
  const { t } = await translation('metadata');
  const ld = ldModule.generate({
    description: t('healthform.description'),
    title: t('healthform.title'),
    url: '/health',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <Flexbox gap={mobile ? 16 : 24}>
        <HealthForm />
      </Flexbox>
    </>
  );
};

Page.displayName = 'HealthForm';

export default Page;

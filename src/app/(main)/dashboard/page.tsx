import { Flexbox } from 'react-layout-kit';

import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

import ChartList from './features/ChartList';

export const generateMetadata = async () => {
  const { t } = await translation('metadata');
  return metadataModule.generate({
    description: t('dashboard.description'),
    title: t('dashboard.title'),
    url: '/dashboard',
  });
};

const Page = async () => {
  const mobile = isMobileDevice();
  const { t } = await translation('metadata');
  const ld = ldModule.generate({
    description: t('dashboard.description'),
    title: t('dashboard.title'),
    url: '/dashboard',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <Flexbox gap={mobile ? 16 : 24}>
        <ChartList />
      </Flexbox>
    </>
  );
};

Page.displayName = 'Dashboard';

export default Page;

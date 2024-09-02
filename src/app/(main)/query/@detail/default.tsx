import { memo } from 'react';

import { isMobileDevice } from '@/utils/responsive';

import MedicalDetailContent from './features/MedicalDetailContent';


const Detail = memo(() => {
  const mobile = isMobileDevice();
  return <MedicalDetailContent mobile={mobile} />;
});

Detail.displayName = 'MedicalDetail';

export default Detail;

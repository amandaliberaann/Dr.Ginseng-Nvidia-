import { Flexbox } from 'react-layout-kit';

import SafeSpacing from '@/components/SafeSpacing';
import { MAX_WIDTH } from '@/const/layoutTokens';

import Hero from './Hero';
import { LayoutProps } from './type';

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Flexbox
        height={'100%'}
        id={'lobe-market-container'}
        style={{ position: 'relative' }}
        width={'100%'}
      >
        <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width={'100%'}>
          <Flexbox
            align={'center'}
            flex={1}
            padding={16}
            style={{ overflowX: 'hidden', overflowY: 'scroll', position: 'relative' }}
          >
            <SafeSpacing />
            <Flexbox gap={16} style={{ maxWidth: MAX_WIDTH, position: 'relative', width: '100%' }}>
              <Hero />
              {children}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Flexbox>
      {/* ↓ cloud slot ↓ */}

      {/* ↑ cloud slot ↑ */}
    </>
  );
};

Layout.displayName = 'DesktopDashboardLayout';

export default Layout;

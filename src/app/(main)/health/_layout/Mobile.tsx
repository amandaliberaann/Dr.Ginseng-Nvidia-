import MobileContentLayout from '@/components/server/MobileNavLayout';

import { LayoutProps } from './type';

const Layout = ({ children }: LayoutProps) => {
  return (
    <MobileContentLayout gap={16} style={{ paddingInline: 16, paddingTop: 8 }} withNav>
      {children}
    </MobileContentLayout>
  );
};

Layout.displayName = 'MobileDashboardLayout';

export default Layout;

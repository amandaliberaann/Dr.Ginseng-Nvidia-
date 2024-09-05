import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';
import { LayoutProps } from './_layout/type';

const DashboardLayout = ServerLayout<LayoutProps>({ Desktop, Mobile });

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;

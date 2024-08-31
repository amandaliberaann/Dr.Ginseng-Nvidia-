import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';
import { LayoutProps } from './_layout/type';

const QueryLayout = ServerLayout<LayoutProps>({ Desktop, Mobile });

QueryLayout.displayName = 'QueryLayout';

export default QueryLayout;

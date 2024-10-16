import { ActionIcon } from '@lobehub/ui';
// import { Compass, FolderClosed, MessageSquare } from 'lucide-react';
import { BookOpenCheck, Gauge, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
// import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';

export interface TopActionProps {
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab }) => {
  const { t } = useTranslation('common');
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);
  // const { showMarket } = useServerConfigStore(featureFlagsSelectors);
  // const { enableKnowledgeBase } = useServerConfigStore(featureFlagsSelectors);

  return (
    <>
      {/* dashboard page */}
      <Link aria-label={t('tab.chat')} href={'/dashboard'}>
        <ActionIcon
          active={tab === SidebarTabKey.Dashboard}
          icon={Gauge}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      {/* query page */}
      <Link aria-label={t('tab.chat')} href={'/query'}>
        <ActionIcon
          active={tab === SidebarTabKey.Query}
          icon={BookOpenCheck}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      {/* chat page */}
      <Link
        aria-label={t('tab.chat')}
        href={'/chat'}
        onClick={(e) => {
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.Chat}
          icon={MessageSquare}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      {/* {enableKnowledgeBase && (
        <Link aria-label={t('tab.files')} href={'/files'}>
          <ActionIcon
            active={tab === SidebarTabKey.Files}
            icon={FolderClosed}
            placement={'right'}
            size="large"
            title={t('tab.files')}
          />
        </Link>
      )}
      {showMarket && (
        <Link aria-label={t('tab.market')} href={'/market'}>
          <ActionIcon
            active={tab === SidebarTabKey.Market}
            icon={Compass}
            placement={'right'}
            size="large"
            title={t('tab.market')}
          />
        </Link>
      )} */}
    </>
  );
});

export default TopActions;

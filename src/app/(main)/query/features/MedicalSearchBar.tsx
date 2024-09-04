'use client';

import { SearchBar } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface AgentSearchBarProps {
  mobile?: boolean;
  searchKeywords: string;
  setSearchKeywords: (value: string) => void;
}

const AgentSearchBar = memo<AgentSearchBarProps>(
  ({ mobile, searchKeywords, setSearchKeywords }) => {
    const { t } = useTranslation('query');

    return (
      <SearchBar
        allowClear
        enableShortKey={!mobile}
        onChange={(e) => setSearchKeywords(e.target.value)}
        placeholder={t('placeholder')}
        shortKey={'k'}
        spotlight={!mobile}
        type={mobile ? 'block' : 'ghost'}
        value={searchKeywords}
      />
    );
  },
);

export default AgentSearchBar;

'use client';

import { memo, useState, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import AgentSearchBar from './AgentSearchBar';
import MedicalList from './MedicalList';
import TagList from './TagList';

interface DashboardProps {
  mobile?: boolean;
}

const MedicalDashboard = memo<DashboardProps>(({ mobile }) => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // 当 searchKeywords 为空时，重置 selectedTag
  useEffect(() => {
    if (!searchKeywords) {
      setSelectedTag(''); // 重置标签选择
    }
  }, [searchKeywords]);

  return (
    <>
      <AgentSearchBar
        mobile={mobile}
        searchKeywords={searchKeywords}
        setSearchKeywords={setSearchKeywords}
      />
      <Flexbox gap={mobile ? 16 : 24}>
        <TagList searchKeywords={searchKeywords} setSelectedTag={setSelectedTag} />
        <MedicalList mobile={mobile} searchKeywords={searchKeywords} selectedTag={selectedTag} />
      </Flexbox>
    </>
  );
});

export default MedicalDashboard;

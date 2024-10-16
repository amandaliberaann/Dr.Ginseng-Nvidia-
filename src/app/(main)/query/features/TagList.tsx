'use client';

import { Button, Skeleton } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { startCase } from 'lodash-es';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  active: css`
    color: ${token.colorBgLayout};
    background: ${token.colorPrimary};

    &:hover {
      color: ${token.colorBgLayout} !important;
      background: ${token.colorPrimary} !important;
    }
  `,
  tag: css`
    background: ${isDarkMode ? token.colorBgContainer : token.colorFillTertiary};
    border: none;

    &:hover {
      background: ${isDarkMode ? token.colorBgElevated : token.colorFill} !important;
    }
  `,
}));

interface TagListProps {
  searchKeywords: string; // 新增接收 searchKeywords
  setSelectedTag: (tag: string) => void;
}

const TagList = memo<TagListProps>(({ setSelectedTag, searchKeywords }) => {
  const { t } = useTranslation('query');
  const { cx, styles } = useStyles();
  const { md = true } = useResponsive();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // 提取各个部分的 tags 并合并
    const chineseMedicineTags = Object.values(
      t('chineseMedicineBasics.cards', { returnObjects: true }),
    ).flatMap((card) => card.tags);
    const constitutionHealthTipsTags = Object.values(
      t('constitutionHealthTips.cards', { returnObjects: true }),
    ).flatMap((card) => card.tags);
    const diseasePreventionTags = Object.values(
      t('diseasePrevention.cards', { returnObjects: true }),
    ).flatMap((card) => card.tags);
    const functionalHealthTags = Object.values(
      t('functionalHealth.cards', { returnObjects: true }),
    ).flatMap((card) => card.tags);
    const seasonalHealthTipsTags = Object.values(
      t('seasonalHealthTips.cards', { returnObjects: true }),
    ).flatMap((card) => card.tags);

    // 合并所有 tags 并去重
    const allTags = Array.from(
      new Set([
        ...chineseMedicineTags,
        ...constitutionHealthTipsTags,
        ...diseasePreventionTags,
        ...functionalHealthTags,
        ...seasonalHealthTipsTags,
      ]),
    );
    setTags(allTags);
  }, [t]); // 依赖 `t`，每当 `t` 变化时重新运行

  if (tags.length === 0) {
    return <Skeleton paragraph={{ rows: 4 }} title={false} />;
  }

  // 根据 searchKeywords 过滤标签
  const filteredTags = searchKeywords
    ? tags.filter((tag) => tag.toLowerCase().includes(searchKeywords.toLowerCase()))
    : tags;

  const list = md ? filteredTags : filteredTags.slice(0, 20);

  return (
    <Flexbox gap={6} horizontal style={{ flexWrap: 'wrap' }}>
      {list.map((item) => (
        <Button
          className={cx(styles.tag)}
          key={item}
          onClick={() => {
            setSelectedTag(String(item));
          }}
          onDoubleClick={() => {
            setSelectedTag(''); // 双击取消标签选择
          }}
          shape={'round'}
          size={'small'}
        >
          {startCase(item)}
        </Button>
      ))}
    </Flexbox>
  );
});

export default TagList;

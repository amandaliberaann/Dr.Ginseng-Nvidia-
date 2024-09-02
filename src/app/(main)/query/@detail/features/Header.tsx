import { Tag } from '@lobehub/ui';
import { startCase } from 'lodash-es';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { useStyles } from './style';

interface HeaderProps {
  description: string;
  tags: string[];
  title: string;
}

const Header = memo<HeaderProps>(({ title, description, tags }) => {
  const { styles } = useStyles();

  return (
    <Center className={styles.container} gap={16}>
      <h2 className={styles.title}>{title}</h2>
      <Center gap={6} horizontal style={{ flexWrap: 'wrap' }}>
        {tags.map((tag: string, index) => (
          <Tag key={index} style={{ margin: 0 }}>
            {startCase(tag).trim()}
          </Tag>
        ))}
      </Center>
      <div className={styles.desc}>{description}</div>
    </Center>
  );
});

export default Header;

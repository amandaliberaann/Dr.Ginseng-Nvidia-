import { Avatar, Tag } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { startCase } from 'lodash-es';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import MedicalCardBanner from './MedicalCardBanner';

const { Paragraph, Title } = Typography;

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  banner: css`
    opacity: ${isDarkMode ? 0.9 : 0.4};
  `,
  container: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    height: 100%;

    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary}
      inset;

    transition: box-shadow 0.2s ${token.motionEaseInOut};

    &:hover {
      box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillSecondary : token.colorFill} inset;
    }
  `,
  desc: css`
    min-height: 44px;
    margin-block-end: 0 !important;
    color: ${token.colorTextDescription};
  `,
  inner: css`
    padding: 16px;
  `,
  time: css`
    color: ${token.colorTextDescription};
  `,
  title: css`
    margin-block-end: 0 !important;
    font-size: 18px !important;
    font-weight: bold;
  `,
}));

interface SimpleCardProps {
  avatar: string;
  description: string;
  identifier: string;
  onClick: (id: string) => void; // click function
  tags: string[];
  title: string;
  variant?: 'default' | 'compact';
}

const MedicalCard = memo<SimpleCardProps>(
  ({ avatar, title, description, tags, identifier, onClick, variant }) => {
    const { styles, theme } = useStyles();
    const isCompact = variant === 'compact';

    return (
      <Flexbox
        className={styles.container}
        gap={24}
        key={identifier}
        onClick={() => onClick(identifier)} // click and send identifier
      >
        {!isCompact && <MedicalCardBanner avatar={avatar} />}
        <Flexbox className={styles.inner} gap={12}>
          <Flexbox align={'flex-end'} gap={16} horizontal justify={'space-between'} width={'100%'}>
            <Title className={styles.title} ellipsis={{ rows: 1, tooltip: title }} level={3}>
              {title}
            </Title>
            {isCompact ? (
              <Avatar
                alt={title}
                avatar={avatar}
                size={40}
                style={{ alignSelf: 'flex-end' }}
                title={title}
              />
            ) : (
              <Center
                flex={'none'}
                height={64}
                style={{
                  background: theme.colorBgContainer,
                  borderRadius: '50%',
                  marginTop: -6,
                  overflow: 'hidden',
                  zIndex: 2,
                }}
                width={64}
              >
                <Avatar alt={title} avatar={avatar} size={56} title={title} />
              </Center>
            )}
          </Flexbox>
          <Paragraph className={styles.desc} ellipsis={{ rows: 2 }}>
            {description}
          </Paragraph>
          <Flexbox gap={6} horizontal style={{ flexWrap: 'wrap' }}>
            {(tags as string[])
              .slice(0, 4)
              .filter(Boolean)
              .map((tag: string, index) => (
                <Tag key={index} style={{ margin: 0 }}>
                  {startCase(tag).trim()}
                </Tag>
              ))}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);

MedicalCard.displayName = 'MedicalCard';

export default MedicalCard;

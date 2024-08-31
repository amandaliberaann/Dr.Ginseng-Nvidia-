'use client';

import { Card, Col, Row, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Heart } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import LazyLoad from 'react-lazy-load';


const Echart = dynamic(() => import('@/app/(main)/chart/EChart'), { ssr: false });
const LineChart = dynamic(() => import('@/app/(main)/chart/LineChart'), { ssr: false });

const { Title } = Typography;

const useStyles = createStyles(({ css, responsive }) => ({
  bnb2: css`
    color: #52c41a;
    font-weight: 700;
  `,
  chartCard: css`
    min-height: 300px;
    margin-bottom: 24px;
  `,
  container: css`
    overflow-y: auto;
    max-height: 100vh;
    padding: 24px;
  `,
  title: css`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    ${responsive.mobile} {
      font-size: 20px;
    }
  `,
}));

const Hero = memo(() => {
  const { styles } = useStyles();
  const dollor = <Heart />;
  const profile = <Heart />;
  const heart = <Heart />;
  const cart = <Heart />;

  const count = [
    {
      today: 'Today’s Sales',
      title: '$53,000',
      persent: '+30%',
      icon: dollor,
      bnb: 'bnb2',
    },
    {
      today: 'Today’s Users',
      title: '3,200',
      persent: '+20%',
      icon: profile,
      bnb: 'bnb2',
    },
    {
      today: 'New Clients',
      title: '+1,200',
      persent: '-20%',
      icon: heart,
      bnb: 'redtext',
    },
    {
      today: 'New Orders',
      title: '$13,200',
      persent: '10%',
      icon: cart,
      bnb: 'bnb2',
    },
  ];

  return (
    <div className={styles.container}>
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        {count.map((c, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox">
              <div className="number">
                <Row align="middle" gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{c.today}</span>
                    <Title level={3}>
                      {c.title} <small className={c.bnb}>{c.persent}</small>
                    </Title>
                  </Col>
                  <Col xs={6}>
                    <div className="icon-box">{c.icon}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <LazyLoad className={styles.chartCard}>
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </LazyLoad>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
          <LazyLoad className={styles.chartCard}>
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </LazyLoad>
        </Col>
      </Row>
    </div>
  );
});

export default Hero;
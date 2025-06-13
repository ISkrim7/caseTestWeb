import { Card, Space } from 'antd';
import React from 'react';

interface SelfProps {
  themSetter: React.Dispatch<React.SetStateAction<string>>;
}

const MindThem: React.FC<SelfProps> = ({ themSetter }) => {
  const themItems = [
    {
      name: '脑图经典',
      value: 'autumn',
      url: '/mindImages/them/autumn.png',
    },
    {
      name: '暗黑',
      value: 'blackHumour',
      url: '/mindImages/them/black.png',
    },
    {
      name: '淡蓝',
      value: 'blueSky',
      url: '/mindImages/them/blue.png',
    },
  ];
  return (
    <Space direction={'vertical'}>
      {themItems.map((item) => (
        <Card
          onClick={() => {
            themSetter(item.value);
          }}
          title={item.name}
          hoverable
          cover={<img alt="example" src={item.url} />}
        />
      ))}
    </Space>
  );
};

export default MindThem;

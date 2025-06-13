import { Card, Space } from 'antd';
import React from 'react';
interface SelfProps {
  layoutSetter: React.Dispatch<React.SetStateAction<string>>;
}

const MIndLayout: React.FC<SelfProps> = ({ layoutSetter }) => {
  const LayoutItems = [
    {
      value: 'logicalStructure',
      url: '/mindImages/layout/CatalogOrganizationLeft.png',
    },
    {
      value: 'organizationStructure',
      url: '/mindImages/layout/organizationStructure.png',
    },
    {
      value: 'mindMap',
      url: '/mindImages/layout/mindMap.png',
    },
  ];
  return (
    <Space direction={'vertical'}>
      {LayoutItems.map((item) => (
        <Card
          onClick={() => {
            layoutSetter(item.value);
          }}
          hoverable
          cover={<img alt="example" src={item.url} />}
        />
      ))}
    </Space>
  );
};

export default MIndLayout;

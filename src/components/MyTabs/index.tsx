import { Tabs } from 'antd';
import React, { FC } from 'react';

interface IProps {
  defaultActiveKey: string;
  tabBarExtraContent?: React.ReactNode;
  items: any[];
  tabPosition?: 'top' | 'left';
  title?: string;
  onChangeKey?: (key: string) => void;
  type?: 'line' | 'card' | 'editable-card';
}

const Index: FC<IProps> = ({
  defaultActiveKey,
  tabPosition = 'top',
  items,
  tabBarExtraContent,
  title,
  onChangeKey,
  type,
}) => {
  return (
    <Tabs
      title={title}
      type={type || 'card'}
      size={'large'}
      onChange={(key: string) => {
        onChangeKey?.(key);
      }}
      tabPosition={tabPosition}
      defaultActiveKey={defaultActiveKey}
      items={items}
      tabBarExtraContent={tabBarExtraContent}
    />
  );
};
export default Index;

import { Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { FC } from 'react';

interface IProps {
  defaultActiveKey: string;
  tabBarExtraContent?: React.ReactNode;
  items: Tab[];
  tabPosition?: 'top' | 'left';
  title?: string;
}

const Index: FC<IProps> = ({
  defaultActiveKey,
  tabPosition = 'top',
  items,
  tabBarExtraContent,
  title,
}) => {
  return (
    <Tabs
      title={title}
      type={'card'}
      size={'large'}
      tabPosition={tabPosition}
      defaultActiveKey={defaultActiveKey}
      items={items}
      tabBarExtraContent={tabBarExtraContent}
    />
  );
};
export default Index;

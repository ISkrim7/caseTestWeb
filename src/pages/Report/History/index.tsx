import UIMultiple from '@/pages/Report/History/UIMultiple';
import UISingle from '@/pages/Report/History/UISingle';
import { useParams } from '@@/exports';
import { PieChartOutlined, RobotOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useAccess } from 'umi';

const TabPane = Tabs.TabPane;
const Index: FC = () => {
  const { isAdmin } = useAccess();
  const { tagId } = useParams<{
    tagId: string;
  }>();
  const [tag, setTag] = useState('0');
  useEffect(() => {
    if (tagId) {
      console.log(typeof tagId);
      console.log('==tag', tagId);
      setTag(tagId);
    }
  }, [tagId]);

  return (
    <ProCard bordered hoverable style={{ height: '100vh', overflow: 'auto' }}>
      <Tabs
        style={{ width: '100%', height: '100%' }}
        tabPosition={'top'}
        size={'large'}
        activeKey={tag}
        onChange={(tag) => {
          setTag(tag);
        }}
      >
        <TabPane
          tab={
            <>
              <RobotOutlined style={{ color: 'orange' }} /> UI 单个运行历史
            </>
          }
          key={'4'}
        >
          <UISingle />
        </TabPane>
        <TabPane
          tab={
            <>
              <PieChartOutlined style={{ color: 'orange' }} /> UI 批量运行历史
            </>
          }
          key={'5'}
        >
          <UIMultiple />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;

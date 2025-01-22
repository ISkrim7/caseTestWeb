import EnvConfig from '@/pages/Play/PlayConfig/EnvConfig';
import PlayCommonStepTable from '@/pages/Play/PlayConfig/PlayCommonStepTable';
import UIMethodConfig from '@/pages/Play/PlayConfig/UIMethodConfig';
import CommonStepsGroup from '@/pages/UIPlaywright/Config/CommonStepsGroup';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [tag, setTag] = useState('0');

  return (
    <ProCard style={{ height: 'auto' }}>
      <Tabs
        tabPosition={'top'}
        type={'card'}
        defaultValue={tag}
        size={'large'}
        onChange={setTag}
        style={{ marginTop: '20px' }}
      >
        <Tabs.TabPane tab={'环境'} key={'0'}>
          <EnvConfig />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'步骤方法'} key={'1'}>
          <UIMethodConfig />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'公共步骤'} key={'2'}>
          <PlayCommonStepTable />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'公共步骤组'} key={'3'}>
          <CommonStepsGroup />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;

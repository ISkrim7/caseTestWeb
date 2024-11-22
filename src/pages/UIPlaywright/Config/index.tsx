import CommonSteps from '@/pages/UIPlaywright/Config/CommonSteps';
import CommonStepsGroup from '@/pages/UIPlaywright/Config/CommonStepsGroup';
import EnvOptions from '@/pages/UIPlaywright/Config/EnvOptions';
import MethodOption from '@/pages/UIPlaywright/Config/MethodOption';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [tag, setTag] = useState('0');

  return (
    <ProCard style={{ height: 'auto' }}>
      <Tabs
        tabPosition={'left'}
        type={'card'}
        defaultValue={tag}
        size={'large'}
        onChange={setTag}
        style={{ marginTop: '20px' }}
      >
        <Tabs.TabPane tab={'运行环境'} key={'3'}>
          <EnvOptions />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'步骤方法'} key={'0'}>
          <MethodOption />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'公共步骤'} key={'1'}>
          <CommonSteps />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'公共步骤组'} key={'4'}>
          <CommonStepsGroup />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;

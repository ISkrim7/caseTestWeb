import API from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API';
import SQL from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/SQL';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC } from 'react';

interface SelfProps {
  stepId: number;
  reload: () => void;
}

const Index: FC<SelfProps> = (props) => {
  return (
    <ProCard>
      <Tabs tabPosition={'left'} size={'small'}>
        <Tabs.TabPane key={'1'} tab={'接口请求(Beta)'}>
          <API {...props} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab={'执行SQL(Beta)'}>
          <SQL {...props} />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;

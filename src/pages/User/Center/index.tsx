import React, { useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';

import UserInfo from '@/pages/User/Center/components/userInfo';
import SetPwd from '@/pages/User/Center/components/setPwd';

const Index = () => {
  const [activeKey, setActiveKey] = useState('2');

  return (
    <>
      <ProCard bordered style={{ height: '100vh' }}>
        <Tabs
          tabPosition={'left'}
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key);
          }}
        >
          <Tabs.TabPane key={'2'} tab={'信息'}>
            <UserInfo />
          </Tabs.TabPane>
          <Tabs.TabPane key={'1'} tab={'修改密码'}>
            <SetPwd />
          </Tabs.TabPane>
        </Tabs>
      </ProCard>
    </>
  );
};

export default Index;

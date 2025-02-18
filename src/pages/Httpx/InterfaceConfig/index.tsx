import InterApiHeaders from '@/pages/Httpx/InterfaceConfig/InterApiHeaders';
import InterApiVariables from '@/pages/Httpx/InterfaceConfig/InterApiVariables';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';

const Index = () => {
  return (
    <ProCard>
      <Tabs
        tabPosition={'top'}
        type={'card'}
        defaultValue={'1'}
        size={'large'}
        style={{ marginTop: '20px' }}
      >
        <Tabs.TabPane tab={'全局变量'} key={'1'}>
          <InterApiVariables />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'默认请求头'} key={'2'}>
          <InterApiHeaders />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;

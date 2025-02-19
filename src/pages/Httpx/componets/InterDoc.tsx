import FuncScriptDesc from '@/pages/Httpx/componets/funcScriptDesc';
import { FunctionOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';

const InterDoc = () => {
  return (
    <ProCard bodyStyle={{ padding: 0 }}>
      <Tabs defaultActiveKey="1" size={'small'} tabPosition={'left'}>
        <Tabs.TabPane key="1" tab="内置Func" icon={<FunctionOutlined />}>
          <FuncScriptDesc />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default InterDoc;

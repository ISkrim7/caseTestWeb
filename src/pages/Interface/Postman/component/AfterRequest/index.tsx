import AfterFunc from '@/pages/Interface/Postman/component/AfterRequest/AfterFunc';
import { ISteps } from '@/pages/Interface/types';
import { FileTextTwoTone, PythonOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance, Tabs } from 'antd';
import { FC, useState } from 'react';

const { TabPane } = Tabs;

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  currentProjectId: string;
}

const Index: FC<ISelfProps> = (props) => {
  const [activeKey, setActiveKey] = useState('1');

  return (
    <Tabs
      style={{ height: 'auto' }}
      activeKey={activeKey}
      tabPosition={'left'}
      onChange={(key) => setActiveKey(key)}
    >
      <TabPane
        key={'1'}
        icon={<PythonOutlined style={{ color: 'orange' }} />}
        tab={'后置python方法'}
      >
        <AfterFunc {...props} />
      </TabPane>
      <TabPane
        key={'2'}
        icon={<FileTextTwoTone twoToneColor={'orange'} />}
        tab={'构造一个数据'}
      >
        <ProCard style={{ height: '10vh' }}>
          <span style={{ color: 'grey' }}>暂未开放</span>
        </ProCard>
      </TabPane>
    </Tabs>
  );
};

export default Index;

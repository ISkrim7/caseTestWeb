import BeforeFunc from '@/pages/Interface/Postman/component/BeforeRequest/BeforeFunc';
import BeforeParams from '@/pages/Interface/Postman/component/BeforeRequest/BeforeParams';
import StructureJobList from '@/pages/Interface/Postman/component/StructureData/StructureJobList';
import { ISteps } from '@/pages/Interface/types';
import {
  DatabaseTwoTone,
  FileTextTwoTone,
  PythonOutlined,
} from '@ant-design/icons';
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
        icon={<DatabaseTwoTone twoToneColor="orange" />}
        tab={<span>添加前置变量</span>}
      >
        <BeforeParams {...props} />
      </TabPane>
      <TabPane
        key={'2'}
        icon={<PythonOutlined style={{ color: 'orange' }} />}
        tab={<span>前置python方法</span>}
      >
        <BeforeFunc {...props} />
      </TabPane>
      <TabPane
        key={'3'}
        icon={<FileTextTwoTone twoToneColor={'orange'} />}
        tab={<span>构造一个数据</span>}
      >
        <StructureJobList {...props} />
      </TabPane>
    </Tabs>
  );
};

export default Index;

import LeftComponents from '@/pages/DebuggerPage/part/LeftComponents';
import { ProCard } from '@ant-design/pro-components';
import { Space, Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentCasePartId2, setCurrentCasePartId2] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'DEBUGGE';
  const ModuleType1 = 1;
  const ModuleType2 = 2;

  return (
    <ProCard
      bordered={true}
      style={{ height: 'auto' }}
      bodyStyle={{ height: 'auto', padding: 0 }}
    >
      <Splitter>
        <Splitter.Panel
          collapsible={true}
          defaultSize="20%"
          min="10%"
          max="30%"
          style={{ height: '100vh' }}
        >
          <LeftComponents
            moduleType={ModuleType1}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentModuleId={setCurrentCasePartId2}
          />

          <LeftComponents
            moduleType={ModuleType2}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentModuleId={setCurrentCasePartId}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <Space direction={'vertical'}>
            <a>currentCasePartId {currentCasePartId}</a>
            <a>currentProjectId {currentProjectId}</a>
            <a>currentProjectId2 {currentCasePartId2}</a>
          </Space>
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;

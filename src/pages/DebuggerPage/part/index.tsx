import LeftPart from '@/pages/DebuggerPage/part/LeftPart';
import { ProCard } from '@ant-design/pro-components';
import { Space, Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'DEBUGGE';

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
          <LeftPart
            perKey={PerKey}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <Space direction={'vertical'}>
            <a>currentCasePartId {currentCasePartId}</a>
            <a>currentProjectId {currentProjectId}</a>
          </Space>
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;

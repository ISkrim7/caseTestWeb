import LeftPart from '@/components/LeftPart';
import InterfaceApiCaseTaskTable from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskTable';
import { ProCard } from '@ant-design/pro-components';
import { Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceTask';
  return (
    <ProCard
      bordered={true}
      style={{ height: '100vh' }}
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
          <InterfaceApiCaseTaskTable
            currentPartId={currentCasePartId}
            currentProjectId={currentProjectId}
            perKey={PerKey}
          />
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;

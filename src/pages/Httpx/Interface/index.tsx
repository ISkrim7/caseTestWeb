import LeftPart from '@/components/LeftPart';
import InterfaceApiTable from '@/pages/Httpx/Interface/InterfaceApiTable';
import { ProCard } from '@ant-design/pro-components';
import { Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceApi';
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
          <InterfaceApiTable
            currentProjectId={currentProjectId}
            currentPartId={currentCasePartId}
            perKey={PerKey}
          />
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;

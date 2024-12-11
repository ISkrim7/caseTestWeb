import LeftPart from '@/components/LeftPart';
import InterfaceApiCaseTaskTable from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskTable';
import { ProCard } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const splitPaneRef = useRef<SplitterLayout>(null);
  const PerKey = 'InterfaceTask';
  return (
    <ProCard
      bordered={true}
      style={{ height: '100vh' }}
      bodyStyle={{ height: 'auto', padding: 0 }}
    >
      <SplitterLayout
        ref={splitPaneRef}
        percentage={true}
        secondaryInitialSize={75}
        primaryMinSize={25}
        secondaryMinSize={60}
      >
        <LeftPart
          perKey={PerKey}
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          setCurrentCasePartId={setCurrentCasePartId}
        />
        <InterfaceApiCaseTaskTable
          currentPartId={currentCasePartId}
          currentProjectId={currentProjectId}
          perKey={PerKey}
        />
      </SplitterLayout>
    </ProCard>
  );
};

export default Index;

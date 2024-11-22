import LeftPart from '@/components/LeftPart';
import InterfaceTaskTable from '@/pages/Interface/InterfaceTask/InterfaceTaskTable';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<
    number | undefined
  >();
  const [currentProjectId, setCurrentProjectId] = useState<number>();

  const splitPaneRef = useRef<SplitterLayout>(null);

  return (
    <PageContainer title={false}>
      <ProCard bodyStyle={{ padding: 0 }} style={{ height: '100vh' }}>
        <SplitterLayout
          ref={splitPaneRef}
          percentage={true}
          secondaryInitialSize={85}
          primaryMinSize={15}
          secondaryMinSize={80}
        >
          <LeftPart
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
          />
          <InterfaceTaskTable
            projectId={currentProjectId!}
            casePartId={currentCasePartId!}
          />
        </SplitterLayout>
      </ProCard>
    </PageContainer>
  );
};

export default Index;

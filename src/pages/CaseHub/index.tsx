import LeftPart from '@/components/LeftPart';
import CaseHubTable from '@/pages/CaseHub/component/CaseHubTable';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const Index = () => {
  const splitPaneRef = useRef<SplitterLayout>(null);
  const [currentCasePartId, setCurrentCasePartId] = useState<
    number | undefined
  >();
  const [currentProjectId, setCurrentProjectId] = useState<number>();

  return (
    <PageContainer title={false}>
      <ProCard
        style={{ height: '100vh', minHeight: '900px' }}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <SplitterLayout
          ref={splitPaneRef}
          percentage={true}
          secondaryInitialSize={80}
          primaryMinSize={15}
          secondaryMinSize={70}
        >
          <LeftPart
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
          />
          <CaseHubTable
            projectID={currentCasePartId!}
            currentCasePartID={currentProjectId!}
          />
        </SplitterLayout>
      </ProCard>
    </PageContainer>
  );
};

export default Index;

import LeftPart from '@/components/LeftPart';
import UICaseTaskTable from '@/pages/UIPlaywright/UICaseTask/UICaseTaskTable';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import 'react-splitter-layout/lib/index.css';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();

  return (
    <PageContainer title={false}>
      <ProCard split="vertical">
        <ProCard colSpan={'15%'} bodyStyle={{ padding: 0 }}>
          <LeftPart
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
            root={true}
          />
        </ProCard>
        <ProCard colSpan={'85%'} bodyStyle={{ padding: 0 }}>
          <UICaseTaskTable
            currentCasePart={currentCasePartId!}
            currentProject={currentProjectId}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Index;

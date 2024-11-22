import LeftPart from '@/components/LeftPart';
import UICaseTable from '@/pages/UIPlaywright/UICase/UICaseTable';
import { ProCard } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const splitPaneRef = useRef<SplitterLayout>(null);

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
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          setCurrentCasePartId={setCurrentCasePartId}
        />
        <UICaseTable
          currentCasePart={currentCasePartId}
          currentProject={currentProjectId}
        />
      </SplitterLayout>
    </ProCard>
  );
};

export default Index;

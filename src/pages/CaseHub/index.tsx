import LeftComponents from '@/components/LeftComponents';
import MyTabs from '@/components/MyTabs';
import CaseDataSource from '@/pages/CaseHub/CaseDataSource';
import RequirementTable from '@/pages/CaseHub/Requirement/RequirementTable';
import { ModuleEnum } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const Index = () => {
  const splitPaneRef = useRef<SplitterLayout>(null);
  const [currentModuleId, setCurrentModuleId] = useState<number | undefined>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();

  const PerKeyRequirement = 'Requirement';
  const PerKeyCaseDataSource = 'CaseDataSource';

  const items = [
    {
      key: '1',
      label: '需求表',
      children: (
        <RequirementTable
          perKey={PerKeyRequirement}
          currentProjectId={currentProjectId}
          currentModuleId={currentModuleId}
        />
      ),
    },
    {
      key: '2',
      label: '用例库',
      children: <CaseDataSource perKey={PerKeyCaseDataSource} />,
    },
  ];
  return (
    <PageContainer title={false}>
      <ProCard
        style={{ height: '100vh', minHeight: '900px' }}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        {/*// @ts-ignore*/}
        <SplitterLayout
          ref={splitPaneRef}
          percentage={true}
          secondaryInitialSize={80}
          primaryMinSize={15}
          secondaryMinSize={70}
        >
          <LeftComponents
            moduleType={ModuleEnum.CASE}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentModuleId={setCurrentModuleId}
          />
          <ProCard>
            <MyTabs defaultActiveKey={'1'} items={items} tabPosition={'top'} />
          </ProCard>
        </SplitterLayout>
      </ProCard>
    </PageContainer>
  );
};

export default Index;

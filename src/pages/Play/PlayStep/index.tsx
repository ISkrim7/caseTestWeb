import LeftComponents from '@/components/LeftComponents';
import MyTabs from '@/components/MyTabs';
import PlayCommonStep from '@/pages/Play/PlayStep/PlayCommonStep';
import PlayStepGroupTable from '@/pages/Play/PlayStep/PlayStepGroup/PlayStepGroupTable';
import { ModuleEnum } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PlayStep = 'PlayStep';
  const PlayStepGroup = 'PlayStepGroup';

  const item = [
    {
      key: 'common',
      label: '步骤',
      children: (
        <PlayCommonStep
          currentModuleId={currentModuleId}
          currentProjectId={currentProjectId}
          perKey={PlayStep}
        />
      ),
    },
    {
      key: 'Group',
      label: '步骤组',
      children: (
        <PlayStepGroupTable
          currentModuleId={currentModuleId}
          currentProjectId={currentProjectId}
          perKey={PlayStepGroup}
        />
      ),
    },
  ];
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
            moduleType={ModuleEnum.UI_STEP}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentModuleId={setCurrentModuleId}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <MyTabs defaultActiveKey={'common'} items={item} />
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;

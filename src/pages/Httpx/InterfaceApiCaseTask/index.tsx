import LeftComponents from '@/components/LeftComponents';
import InterfaceApiCaseTaskTable from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskTable';
import { ModuleEnum } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { useState } from 'react';

const Index = () => {
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceTask';
  const onProjectChange = (projectId: number | undefined) => {
    setCurrentProjectId(projectId);
  };

  const onModuleChange = (moduleId: number) => {
    setCurrentModuleId(moduleId);
  };
  return (
    <ProCard
      bordered={true}
      style={{ height: '100vh' }}
      bodyStyle={{ height: '100%', padding: 0 }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* 左侧固定面板 */}
        <div
          style={{
            width: '20%',
            minWidth: '200px',
            maxWidth: '35%',
            height: '100%',
            padding: '12px',
            overflow: 'auto',
            wordBreak: 'break-word',
          }}
        >
          <LeftComponents
            moduleType={ModuleEnum.API_TASK}
            currentProjectId={currentProjectId}
            onProjectChange={onProjectChange}
            onModuleChange={onModuleChange}
          />
        </div>

        {/* 右侧面板 */}
        <div
          style={{
            flex: 1,
            minWidth: '50%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <InterfaceApiCaseTaskTable
            currentModuleId={currentModuleId}
            currentProjectId={currentProjectId}
            perKey={PerKey}
          />
        </div>
      </div>
    </ProCard>
  );
};

export default Index;

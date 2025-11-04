import LeftComponents from '@/components/LeftComponents';
import InterfaceApiCaseTable from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseTable';
import { ModuleEnum } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { useState } from 'react';

const Index = () => {
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceApiCase';

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
        {/* 左侧面板 - 自适应宽度 */}
        <div
          style={{
            width: '20%',
            minWidth: '200px',
            maxWidth: '30%',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <LeftComponents
            moduleType={ModuleEnum.API_CASE}
            onProjectChange={onProjectChange}
            onModuleChange={onModuleChange}
            currentProjectId={currentProjectId}
          />
        </div>

        {/* 右侧面板 - 自适应剩余宽度 */}
        <div
          style={{
            flex: 1,
            minWidth: '50%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <InterfaceApiCaseTable
            perKey={PerKey}
            currentModuleId={currentModuleId}
            currentProjectId={currentProjectId}
          />
        </div>
      </div>
    </ProCard>
  );
};

export default Index;

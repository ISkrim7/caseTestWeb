import LeftComponents from '@/components/LeftComponents';
import GroupApiTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiTable';
import InterfaceApiTable from '@/pages/Httpx/Interface/InterfaceApiTable';
import InterfaceApiTableNoModule from '@/pages/Httpx/Interface/InterfaceApiTableNoModule';
import InterfaceApiUpload from '@/pages/Httpx/Interface/InterfaceApiUpload';
import { ModuleEnum } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { TabsProps } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceApi';
  const PerKeyNoPart = 'InterfaceApiNoPart';
  const PerGroupKey = 'InterfaceGroupApi';

  const TabItems: TabsProps['items'] = [
    {
      key: 'api',
      label: 'Common API',
      children: (
        <InterfaceApiTable
          currentProjectId={currentProjectId}
          currentModuleId={currentModuleId}
          perKey={PerKey}
        />
      ),
    },
    {
      key: 'group',
      label: 'Group API',
      children: (
        <GroupApiTable
          currentProjectId={currentProjectId}
          currentModuleId={currentModuleId}
          perKey={PerGroupKey}
        />
      ),
    },
    {
      key: 'no part',
      label: 'No Part API',
      children: (
        <InterfaceApiTableNoModule
          currentProjectId={currentProjectId}
          perKey={PerKeyNoPart}
        />
      ),
    },
    {
      key: 'upload',
      label: 'Upload API',
      children: <InterfaceApiUpload />,
    },
  ];

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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 上半部分：LeftComponents - 占80%高度 */}
          <div
            style={{
              height: '80%',
              minHeight: '150px',
              padding: '12px',
              overflow: 'auto',
              wordBreak: 'break-word',
            }}
          >
            <LeftComponents
              moduleType={ModuleEnum.API}
              currentProjectId={currentProjectId}
              onProjectChange={onProjectChange}
              onModuleChange={onModuleChange}
            />
          </div>

          {/* 下半部分：视图 - 占20%高度 */}
          <div
            style={{
              height: '20%',
              minHeight: '100px',
              overflow: 'auto',
            }}
          >
            <ProCard
              title="视图"
              style={{ height: '100%' }}
              bodyStyle={{ padding: '12px' }}
            >
              {/* 视图内容 */}
            </ProCard>
          </div>
        </div>

        {/* 右侧面板 */}
        <div
          style={{
            flex: 1,
            minWidth: '50%',
            height: '100%',
          }}
        >
          <ProCard
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0, height: '100%' }}
            tabs={{
              type: 'card',
              items: TabItems,
            }}
          />
        </div>
      </div>
    </ProCard>
  );
};

export default Index;

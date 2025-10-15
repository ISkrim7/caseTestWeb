import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import EmptyProject from '@/components/LeftComponents/EmptyProject';
import ModuleTree from '@/components/LeftComponents/ModuleTree';
import ProjectSelect from '@/components/LeftComponents/ProjectSelect';
import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  moduleType: number;
  onProjectChange: (projectId: number | undefined) => void;
  onModuleChange: (moduleId: number) => void;
}

const Index: FC<SelfProps> = (props) => {
  const { currentProjectId, moduleType, onProjectChange, onModuleChange } =
    props;
  const [projects, setProjects] = useState<IProject[]>([]);

  // 首次进入获取项目列表，优先使用本地存储的选择
  useEffect(() => {
    queryProject().then(async ({ data }) => {
      if (data && data.length > 0) {
        setProjects(data);

        // 优先使用本地存储的项目ID
        const savedProjectId = localStorage.getItem('selectedProjectId');
        const initialProjectId = savedProjectId
          ? Number(savedProjectId)
          : data[0].id;

        onProjectChange(initialProjectId);
      }
    });
  }, []);

  return (
    <ProCard style={{ height: 'auto' }} bodyStyle={{ padding: 5 }}>
      {projects.length > 0 ? (
        <Space direction={'vertical'}>
          <ProjectSelect
            projects={projects}
            currentProjectId={currentProjectId}
            onProjectChange={onProjectChange}
            onModuleChange={onModuleChange}
          />
          <ModuleTree
            moduleType={moduleType}
            currentProjectId={currentProjectId}
            onModuleChange={onModuleChange}
          />
        </Space>
      ) : (
        <EmptyProject />
      )}
    </ProCard>
  );
};

export default Index;

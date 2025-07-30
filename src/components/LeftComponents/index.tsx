import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import EmptyProject from '@/components/LeftComponents/EmptyProject';
import ModuleTree from '@/components/LeftComponents/ModuleTree';
import ProjectSelect from '@/components/LeftComponents/ProjectSelect';
import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  moduleType: number;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentModuleId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const Index: FC<SelfProps> = (props) => {
  const {
    currentProjectId,
    moduleType,
    setCurrentProjectId,
    setCurrentModuleId,
  } = props;
  const [projects, setProjects] = useState<IProject[]>([]);

  // 首次进入 获取project Arr  默认选择第一个
  useEffect(() => {
    queryProject().then(async ({ data }) => {
      if (data && data.length > 0) {
        setProjects(data);
        const savedProjectId = localStorage.getItem('selectedProjectId');
        const initialProjectId = savedProjectId
          ? Number(savedProjectId)
          : data[0].id;
        setCurrentProjectId(initialProjectId);
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
            setCurrentProjectId={setCurrentProjectId}
          />
          <ModuleTree
            moduleType={moduleType}
            currentProjectId={currentProjectId}
            setCurrentModuleId={setCurrentModuleId}
          />
        </Space>
      ) : (
        <EmptyProject />
      )}
    </ProCard>
  );
};

export default Index;

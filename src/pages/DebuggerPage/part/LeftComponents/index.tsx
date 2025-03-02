import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import EmptyProject from '@/pages/DebuggerPage/part/LeftComponents/EmptyProject';
import ModuleTree from '@/pages/DebuggerPage/part/LeftComponents/ModuleTree';
import ProjectSelect from '@/pages/DebuggerPage/part/LeftComponents/ProjectSelect';
import { ProCard } from '@ant-design/pro-components';
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
        setCurrentProjectId(data[0].id);
      }
    });
  }, []);

  return (
    <ProCard style={{ height: 'auto' }}>
      {projects.length > 0 ? (
        <>
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
        </>
      ) : (
        <EmptyProject />
      )}
    </ProCard>
  );
};

export default Index;

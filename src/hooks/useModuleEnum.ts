// hooks/useModuleEnum.ts
import { IModule, IModuleEnum } from '@/api';
import { queryTreeModuleByProject } from '@/api/base';
import { useEffect, useState } from 'react';

const loopData = (data: IModule[]): IModuleEnum[] => {
  return data.map((item) => {
    if (item.children) {
      return {
        title: item.title,
        value: item.key,
        children: loopData(item.children),
      };
    }
    return { title: item.title, value: item.key };
  });
};

export function useModuleEnum(projectId?: number, moduleType?: number) {
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);

  useEffect(() => {
    if (!projectId || !moduleType) {
      setModuleEnum([]);
      return;
    }

    const fetchData = async () => {
      const { code, data } = await queryTreeModuleByProject(
        projectId,
        moduleType,
      );
      if (code === 0) {
        setModuleEnum(loopData(data));
      } else {
        setModuleEnum([]);
      }
    };

    fetchData();
  }, [projectId, moduleType]);

  return moduleEnum;
}

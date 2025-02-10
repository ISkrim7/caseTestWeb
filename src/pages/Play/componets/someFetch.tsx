import { IQueryPartTree } from '@/api';
import { queryTreePartByProject } from '@/api/base';
import { CasePartEnum } from '@/pages/Play/componets/uiTypes';
import React from 'react';

const loopData = (data: IQueryPartTree[]): CasePartEnum[] => {
  return data.map((item) => {
    if (item.children) {
      return {
        title: item.title,
        value: item.id,
        children: loopData(item.children),
      };
    }
    return { title: item.title, value: item.id };
  });
};

/**
 * 获取模块
 * @param projectId
 * @param setCasePartEnum
 */
export const fetchCaseParts = async (
  projectId: number,
  setCasePartEnum: React.Dispatch<React.SetStateAction<CasePartEnum[]>>,
) => {
  const { code, data } = await queryTreePartByProject(projectId);
  if (code === 0) {
    setCasePartEnum(loopData(data));
  } else {
    setCasePartEnum([]);
  }
};

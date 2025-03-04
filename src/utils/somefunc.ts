import React from 'react';
import {  IUIEnv } from '@/pages/Play/componets/uiTypes';
import { queryTreeModuleByProject } from '@/api/base';
import { IModule, IModuleEnum, IObjGet } from '@/api';
import { queryUIEnvs } from '@/api/play/env';

export const pageData = async (code: number, data: any, setter?: any) => {
  if (code === 0) {
    if (setter) {
      setter(data.items);
    }
    return {
      data: data.items,
      total: data.pageInfo.total,
      success: true,
      pageSize: data.pageInfo.page,
      current: data.pageInfo.limit,
    };
  }
  return {
    data: [],
    success: false,
    total: 0,
  };
};

export const queryData = async (code: number, data: any, setter?: any) => {
  if (code === 0) {
    if (setter) {
      setter(data);
    }
    return {
      data: data,
      total: data.length,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
    total: 0,
  };
};

export const data2LabelValue = (data: any) => {
  return data?.map((item: any) => ({
    label: item.title,
    value: item.id,
  }));
};


/**
 * 获取模块
 * @param projectId
 * @param module_Type
 * @param setModuleEnum
 */
export const fetchModulesEnum = async (
  projectId: number,
  module_Type: number,
  setModuleEnum: React.Dispatch<React.SetStateAction<IModuleEnum[]>>,
) => {
  const { code, data } = await queryTreeModuleByProject(projectId, module_Type);
  if (code === 0) {
    setModuleEnum(loopData(data));
  } else {
    setModuleEnum([]);
  }
};

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



export const queryUIEnvEnum = async (
  setter: React.Dispatch<React.SetStateAction<IObjGet>>,
) => {
  queryUIEnvs().then(async ({ code, data }) => {
    if (code === 0) {
      const envOptions = Object.create(null);
      for (const item of data) {
        envOptions[item.id] = item.name;
      }
      setter(envOptions);
    }
  });
};


export const queryUIEnvList =async (
  setter: React.Dispatch<React.SetStateAction<{ label: string; value: number | null }[]>>,
)=>{
  queryUIEnvs().then(async ({code,data})=>{
    if (code === 0) {
      const envs = data.map((item: IUIEnv) => ({
        label: item.name,
        value: item.id,
      }));
      setter(envs);
    }
  })
}

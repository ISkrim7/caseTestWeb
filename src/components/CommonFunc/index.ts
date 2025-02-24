import { IEnv } from '@/api';
import { queryEnvBy, queryProject } from '@/api/base';
import React from 'react';

export const queryProjects = async (
  setter: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        value: number;
      }[]
    >
  >,
) => {
  queryProject().then(({ code, data }) => {
    if (code === 0) {
      const projects = data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setter(projects);
    }
  });
};

export const queryProjectEnum = async (
  setter: React.Dispatch<React.SetStateAction<any>>,
) => {
  queryProject().then(({ code, data }) => {
    if (code === 0) {
      const mapData = data.reduce((acc: any, obj) => {
        acc[obj.id] = { text: obj.title };
        return acc;
      }, {});
      setter(mapData);
    }
  });
};

export const queryEnvByProjectIdFormApi = async (
  projectId: number,
  setter: React.Dispatch<
    React.SetStateAction<{ label: string; value: number | null }[]>
  >,
  noEnv: boolean,
) => {
  queryEnvBy({ project_id: projectId } as IEnv).then(({ code, data }) => {
    if (code === 0) {
      // 请求成功
      const envs = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      if (noEnv) {
        const noEnv = { label: '自定义', value: -1 };
        setter([noEnv, ...envs]); // 设置环境列表
      } else {
        setter(envs); // 设置环境列表
      }
    }
  });
};

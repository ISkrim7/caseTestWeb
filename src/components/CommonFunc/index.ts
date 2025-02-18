import { queryProject } from '@/api/base';
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

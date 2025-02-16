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

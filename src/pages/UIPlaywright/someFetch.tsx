import { IObjGet, IQueryPartTree } from '@/api';
import { queryTreePartByProject } from '@/api/base';
import { queryProject } from '@/api/project';
import { fetchEnvsOptions, queryMethodOptions } from '@/api/ui';
import {
  CasePartEnum,
  IUIMethod,
  ProjectEnum,
} from '@/pages/UIPlaywright/uiTypes';
import { Tooltip } from 'antd';
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
 * 项目查询
 */
export const fetchProject = async (
  setProjectEnum: React.Dispatch<React.SetStateAction<ProjectEnum[]>>,
  setProjectEnumMap?: React.Dispatch<React.SetStateAction<IObjGet>>,
) => {
  const { code, data } = await queryProject();
  if (code === 0) {
    const listData = data.map((project: any) => ({
      label: project.name,
      value: project.id,
    }));
    const mapData = listData.reduce((acc: any, obj) => {
      acc[obj.value] = { text: obj.label };
      return acc;
    }, {});
    setProjectEnum(listData);
    setProjectEnumMap?.(mapData);
  }
};

export const fetchQueryEnv = async (
  setEnvOptions: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  const { code, data } = await fetchEnvsOptions('GET');
  if (code === 0) {
    // 创建一个对象，用于将数据按照环境进行分组
    const groupedData: IObjGet = {};
    // 遍历原始数据，并根据环境进行分组
    data.forEach((item) => {
      if (!groupedData[item.env]) {
        groupedData[item.env] = [];
      }
      groupedData[item.env].push({
        label: item.name,
        value: item.uid, // 这里的 value 可以根据实际需求来确定
      });
    });
    // 将分组后的数据转换成所需格式
    const result = Object.keys(groupedData).map((env) => ({
      label: <span>{env}</span>,
      title: env,
      options: groupedData[env],
    }));
    console.log(result);
    setEnvOptions(result);
  } else [];
};

export const fetchQueryEnv2Obj = async (
  setEnvOptions: React.Dispatch<React.SetStateAction<IObjGet>>,
) => {
  const { code, data } = await fetchEnvsOptions('GET');
  if (code === 0) {
    console.log(data);
    // 创建一个对象，用于将数据按照环境进行分组
    const transformedData: IObjGet = {};
    // 遍历原始数据，并根据环境进行分组
    data.forEach((item) => {
      transformedData[item.uid] = `${item.env}-${item.name}`;
    });
    console.log(transformedData);
    setEnvOptions(transformedData);
  }
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

export const fetchUIMethodOptions = async (
  setMethodEnum: React.Dispatch<React.SetStateAction<IObjGet>>,
) => {
  const { code, data } = await queryMethodOptions();
  if (code === 0 && data) {
    // @ts-ignore
    data.sort((a: any, b: any) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
    });
    const methodEnum = data.reduce((acc, item) => {
      const { value, label, desc } = item;
      const text = (
        <Tooltip title={desc}>
          <span>{label}</span>
        </Tooltip>
      );
      return { ...acc, [value]: { text } };
    }, {});
    setMethodEnum(methodEnum);
  }
};

export const fetchUIMethodOptionsToFrom = async (
  setMethodEnum: React.Dispatch<React.SetStateAction<any>>,
  setMethods: React.Dispatch<React.SetStateAction<IUIMethod[]>>,
) => {
  const { code, data } = await queryMethodOptions();
  if (code === 0 && data) {
    setMethods(data);
    // 创建一个对象，用于将数据按照环境进行分组
    const groupedData: IObjGet = {
      常规: [],
      断言: [],
    };
    // 遍历原始数据，并根据环境进行分组
    data.forEach((item) => {
      if (!item.value.startsWith('expect.')) {
        groupedData['常规'].push({
          label: (
            <Tooltip title={item.desc}>
              <span>{item.label}</span>
            </Tooltip>
          ),
          value: item.value, // 这里的 value 可以根据实际需求来确定
          need_locator: item.need_locator,
          need_value: item.need_value,
        });
      } else {
        groupedData['断言'].push({
          label: (
            <Tooltip title={item.desc}>
              <span>{item.label}</span>
            </Tooltip>
          ),
          value: item.value, // 这里的 value 可以根据实际需求来确定
          need_locator: item.need_locator,
          need_value: item.need_value,
        });
      }
    });
    console.log(groupedData);
    const result = Object.keys(groupedData).map((method) => ({
      label: <span>{method}</span>,
      value: method,
      options: groupedData[method],
    }));
    setMethodEnum(result);
  }
};

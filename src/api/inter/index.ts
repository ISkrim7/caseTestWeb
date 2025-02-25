import { IObjGet, IPage, IResponse } from '@/api';
import {
  IInterfaceAPI,
  IInterfaceAPIRecord,
  ITryResponseInfo,
} from '@/pages/Httpx/types';
import { request } from '@@/plugin-request/request';

/**
 * page api
 * @param data
 * @param options
 */
export const uploadInterApi = async (data: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/interface/upload', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * page api
 * @param data
 * @param options
 */
export const pageInterApi = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>('/api/interface/page', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * page api
 * @param data
 * @param options
 */
export const pageInterApiNoPart = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>('/api/interface/pageNoPart', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * page api
 * @param data
 * @param options
 */
export const setInterApisPart = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>(
    '/api/interface/setInterfacePart',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * try api
 * @param data
 * @param options
 */
export const tryInterApi = async (
  data: { interfaceId: string | number },
  options?: IObjGet,
) => {
  return request<IResponse<ITryResponseInfo[]>>('/api/interface/try', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * try api
 * @param data
 * @param options
 */
export const asyncTryInterApi = async (
  data: { interfaceId: number },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<number>>>('/api/interface/asyncTry', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * 接口api详情
 * @param data
 * @param options
 */
export const detailInterApiById = async (
  data?: { interfaceId: string | number },
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceAPI>>('/api/interface/detail', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

/**
 * 新增api
 * @param data
 * @param options
 */
export const insertInterApi = async (
  data?: IInterfaceAPI,
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceAPI>>('/api/interface/insert', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 修改api
 * @param data
 * @param options
 */
export const updateInterApiById = async (
  data?: IInterfaceAPI,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 删除api
 * @param data
 * @param options
 */
export const removeInterApiById = async (data: number, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/remove', {
    method: 'POST',
    data: { id: data },
    ...(options || {}),
  });
};

/**
 * 复制api
 * @param data
 * @param options
 */
export const copyInterApiById = async (data: number, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/copy', {
    method: 'POST',
    data: { id: data },
    ...(options || {}),
  });
};

/**
 * 查询script
 * @param data
 * @param options
 */
export const queryScripts = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/interface/query/script_doc', {
    method: 'GET',
    ...(options || {}),
  });
};
/**
 * 开始录制
 * @param options
 */
export const startApiRecord = async (values: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/interfaceRecord/start/recording', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
};

/**
 * 停止录制
 * @param options
 */
export const clearApiRecord = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/interfaceRecord/clear/recording', {
    method: 'POST',
    data: {},
    ...(options || {}),
  });
};

/**
 * 获取录制信息
 * @param options
 */
export const queryApiRecord = async (options?: IObjGet) => {
  return request<IResponse<IInterfaceAPIRecord[]>>(
    '/api/interfaceRecord/query/record',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

/**
 * 保存录制到api
 * @param options
 */
export const saveRecord2Api = async (data: any, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interfaceRecord/record/save2api', {
    method: 'post',
    data: data,
    ...(options || {}),
  });
};
/**
 * 保存录制到case
 * @param options
 */
export const appendRecord2Case = async (
  data: {
    recordId: string;
    caseId: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interfaceRecord/record/save2case', {
    method: 'post',
    data: data,
    ...(options || {}),
  });
};
/**
 * 去重
 * @param options
 */
export const deduplicationRecord = async (options?: IObjGet) => {
  return request<IResponse<null>>('/api/interfaceRecord/record/deduplication', {
    method: 'post',
    data: {},
    ...(options || {}),
  });
};

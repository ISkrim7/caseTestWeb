import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IInterfaceAPI, ITryResponseInfo } from '@/pages/Httpx/types';
import { request } from '@@/plugin-request/request';

/**
 * page api
 * @param data
 * @param options
 */
export const pageInterApi = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>('/api/interface/page', {
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
  data?: { interfaceId: string },
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

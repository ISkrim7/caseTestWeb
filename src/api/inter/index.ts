import { IObjGet, IResponse } from '@/api';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { request } from '@@/plugin-request/request';

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
  return request<IResponse<null>>('/api/interface/insert', {
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
export const removeInterApiById = async (
  data?: IInterfaceAPI,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/remove', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

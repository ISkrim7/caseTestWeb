import { IObjGet, IPage, IResponse } from '@/api';
import { IInterfaceGroup } from '@/pages/Httpx/types';
import { request } from '@@/plugin-request';

/**
 * 查询group
 * @param data
 * @param options
 */
export const pageInterfaceGroup = async (
  data: any,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<IInterfaceGroup>>>(
    '/api/interface/group/page',
    {
      method: 'POST',
      data,
      ...(options || {}),
    },
  );
};

/**
 * 添加
 * @param data
 * @param options
 */
export const insertInterfaceGroup = async (
  data: IInterfaceGroup,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<IInterfaceGroup>>>(
    '/api/interface/group/insert',
    {
      method: 'POST',
      data,
      ...(options || {}),
    },
  );
};

/**
 * 更新
 * @param data
 * @param options
 */
export const updateInterfaceGroup = async (
  data: IInterfaceGroup,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<null>>>('/api/interface/group/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
/**
 * 详情
 * @param data
 * @param options
 */
export const getInterfaceGroup = async (
  data: string,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<null>>>('/api/interface/group/detail', {
    method: 'GET',
    params: { groupId: data },
    ...(options || {}),
  });
};
/**
 * 更新
 * @param data
 * @param options
 */
export const removeInterfaceGroup = async (
  data: string,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<null>>>('/api/interface/group/remove', {
    method: 'POST',
    data: { id: data },
    ...(options || {}),
  });
};

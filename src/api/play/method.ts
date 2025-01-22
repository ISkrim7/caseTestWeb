import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUIMethod } from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request';

/**
 * 查询方法
 * @param options
 */
export const queryMethods = async (options?: IObjGet) => {
  return request<IResponse<IUIMethod[]>>('/api/ui/config/method/list', {
    method: 'GET',
    ...(options || {}),
  });
};
/**
 * 分页方法
 * @param data
 * @param options
 */
export const pageMethods = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUIMethod>>>('/api/ui/config/method/page', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * 添加方法
 * @param me
 * @param options
 */
export const addMethod = async (me: IUIMethod, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/method/add', {
    method: 'POST',
    data: me,
    ...(options || {}),
  });
};

/**
 * 删除方法
 * @param uid
 * @param options
 */
export const removeMethod = async (uid: string, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/method/remove', {
    method: 'POST',
    data: { uid: uid },
    ...(options || {}),
  });
};

/**
 * 修改方法
 * @param method
 * @param options
 */
export const updateMethod = async (method: IUIMethod, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/method/update', {
    method: 'POST',
    data: method,
    ...(options || {}),
  });
};

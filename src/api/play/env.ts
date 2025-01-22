import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUIEnv } from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request';

/**
 * ui 环境列表
 * @param options
 */
export const queryUIEnvs = async (options?: IObjGet) => {
  return request<IResponse<IUIEnv[]>>('/api/ui/config/env/query', {
    method: 'GET',
    ...(options || {}),
  });
};

/**
 * 添加ui环境
 * @param data
 * @param options
 */
export const addEnv = async (data?: IUIEnv, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/env/add', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * 删除
 * @param data
 * @param options
 */
export const removeEnv = async (data?: { uid: string }, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/env/remove', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * 修改
 * @param data
 * @param options
 */
export const editEnv = async (data?: IUIEnv, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/config/env/edit', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 分页ui环境
 * @param data
 * @param options
 */
export const pageEnv = async (data?: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUIEnv[]>>>('/api/ui/config/env/page', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

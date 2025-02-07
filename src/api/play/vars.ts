import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUIVars } from '@/pages/Play/componets/uiTypes';
import { request } from '@@/plugin-request';

/**
 * 修改Vars
 * @param data
 * @param options
 */
export const updateVars = async (data: IUIVars, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/vars/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 添加 Vars
 * @param data
 * @param options
 */
export const addVars = async (data: IUIVars, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/vars/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 添加 Vars
 * @param data
 * @param options
 */
export const removeVars = async (data: { uid: string }, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/vars/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * query Vars
 * @param data
 * @param options
 */
export const pageVars = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUIVars>>>('/api/ui/case/vars/page', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request';

export const pageSteps = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUICaseSteps>>>('/api/ui/case/step/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

/**
 * 添加step
 * @param data
 * @param options
 */
export const addStep = async (data: IUICaseSteps, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/step/add', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 改step
 * @param data
 * @param options
 */
export const updateStep = async (data: IUICaseSteps, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/step/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * step 详情
 * @param data
 * @param options
 */
export const getStepInfo = async (data: number, options?: IObjGet) => {
  return request<IResponse<IUICaseSteps>>('/api/ui/case/step/detail', {
    method: 'GET',
    params: { stepId: data },
    ...(options || {}),
  });
};

import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUICase, IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request/request';

/**
 * ui 用例分页查询
 * @param params
 * @param options
 */
export const pageUICase = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUICase>>>('/api/ui/case/page', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

/**
 * ui 用例详情
 * @param params
 * @param options
 */
export const uiCaseDetailById = async (
  params: { id: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUICase>>('/api/ui/case/detail', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};
/**
 * 用例步骤详情
 * @param params
 * @param options
 */
export const queryStepByCaseId = async (
  params: { id: string },
  options?: IObjGet,
): Promise<IResponse<IUICaseSteps[]>> => {
  return request<IResponse<IUICaseSteps[]>>('/api/ui/case/step/query', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

/**
 * 用例步骤详情
 * @param params
 * @param options
 */
export const getUICaseStepInfo = async (
  params: { id: string },
  options?: IObjGet,
): Promise<IResponse<IUICaseSteps[]>> => {
  return request<IResponse<IUICaseSteps[]>>('/api/ui/case/step/detail', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

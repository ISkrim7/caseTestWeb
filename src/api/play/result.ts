import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request';

/**
 * 清空调试历史
 * @param data
 * @param options
 */
export const clearUICaseResult = async (
  data: { caseId: number },
  options?: IObjGet,
) => {
  return request('/api/ui/case/result/clear', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

/**
 * 调试历史分页
 * @param data
 * @param options
 */
export const pageDebugResult = async (
  data: ISearch,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<IUIResult>>>('/api/ui/case/result/page', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 调试详情
 * @param data
 * @param options
 */
export const getDebugResultDetail = async (
  data: string,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IUIResult>>('/api/ui/case/result/detail', {
    method: 'GET',
    params: { uid: data },
    ...(options || {}),
  });
};

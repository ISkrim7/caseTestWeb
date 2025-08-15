import { IObjGet, IPage, IResponse } from '@/api';
import { request } from '@@/plugin-request';

/**
 * insertCase
 * @param caseInfo
 * @param options
 */
export const insertCase = async (caseInfo: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/hub/insertCase', {
    method: 'POST',
    data: caseInfo,
    ...(options || {}),
  });
};

/**
 * updateCase
 * @param caseInfo
 * @param options
 */
export const updateCase = async (caseInfo: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/hub/updateCase', {
    method: 'POST',
    data: caseInfo,
    ...(options || {}),
  });
};

/**
 * insertCase
 * @param caseInfo
 * @param options
 */
export const pageCase = async (values: IObjGet, options?: IObjGet) => {
  return request<IResponse<IPage<any>>>('/api/hub/pageCase', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
};

import { IObjGet, IResponse } from '@/api';
import { ITestCase } from '@/pages/CaseHub/type';
import { request } from '@@/plugin-request';

/**
 * queryCasesByRequirement
 * @param requirementId
 * @param options
 */
export const queryCasesByRequirement = async (
  requirementId: string,
  options?: IObjGet,
) => {
  return request<IResponse<ITestCase[]>>('/api/hub/cases/queryByReqId', {
    method: 'GET',
    params: { requirementId: requirementId },
    ...(options || {}),
  });
};

/**
 * saveCase
 * @param caseInfo
 * @param options
 */
export const saveTestCase = async (caseInfo: ITestCase, options?: IObjGet) => {
  return request<IResponse<ITestCase>>('/api/hub/cases/insert', {
    method: 'POST',
    data: caseInfo,
    ...(options || {}),
  });
};

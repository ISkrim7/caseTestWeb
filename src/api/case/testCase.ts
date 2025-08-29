import { IObjGet, IResponse } from '@/api';
import { CaseSubStep, ITestCase } from '@/pages/CaseHub/type';
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

/**
 * saveCase
 * @param caseInfo
 * @param options
 */
export const updateTestCase = async (
  caseInfo: ITestCase,
  options?: IObjGet,
) => {
  return request<IResponse<ITestCase>>('/api/hub/cases/update', {
    method: 'POST',
    data: caseInfo,
    ...(options || {}),
  });
};

/**
 * queryTestCaseSupStep
 * @param caseId
 * @param options
 */
export const queryTestCaseSupStep = async (
  caseId: string,
  options?: IObjGet,
) => {
  return request<IResponse<CaseSubStep[]>>(
    `/api/hub/cases/querySubSteps/${caseId}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

/**
 * queryTestCaseSupStep
 * @param data
 * @param options
 */
export const setTestCaseSupStep = async (
  data: {
    test_case_id: number;
    case_sub_steps: CaseSubStep[];
  },
  options?: IObjGet,
) => {
  return request<IResponse<CaseSubStep[]>>(`/api/hub/cases/setSubSteps`, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

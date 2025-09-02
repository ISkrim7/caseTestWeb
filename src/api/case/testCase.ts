import { IObjGet, IResponse } from '@/api';
import { CaseSubStep, ICaseDynamic, ITestCase } from '@/pages/CaseHub/type';
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

/**
 * queryTestCaseDynamic
 * @param caseId
 * @param options
 */
export const queryTestCaseDynamic = async (
  caseId: number,
  options?: IObjGet,
) => {
  return request<IResponse<ICaseDynamic[]>>(
    `/api/hub/cases/queryDynamic/${caseId}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

/**
 * reorderTestCase
 * @param info
 * @param options
 */
export const reorderTestCase = async (
  info: {
    requirementId: number;
    caseIds: number[];
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/reorder`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

/**
 * reorderTestCase
 * @param info
 * @param options
 */
export const reorderTestCaseStep = async (
  info: {
    stepIds: number[];
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/reorderSupStep`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

/**
 * removeTestCaseStep
 * @param info
 * @param options
 */
export const removeTestCaseStep = async (
  info: {
    stepId: any;
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/removeStep`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

/**
 * copyTestCaseStep
 * @param info
 * @param options
 */
export const copyTestCaseStep = async (
  info: {
    stepId: any;
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/copyStep`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

/**
 * handleAddTestCaseStep
 * @param info
 * @param options
 */
export const handleAddTestCaseStep = async (
  info: {
    caseId: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/handleAddStepLine`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

/**
 * updateTestCaseStep
 * @param info
 * @param options
 */
export const updateTestCaseStep = async (
  info: CaseSubStep,
  options?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/hub/cases/updateSubStep`, {
    method: 'POST',
    data: info,
    ...(options || {}),
  });
};

import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import {
  IUICaseStepAPI,
  IUICaseStepCondition,
  IUICaseSteps,
  IUICaseStepSQL,
  IUICaseSubStep,
} from '@/pages/Play/componets/uiTypes';
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
 * 删除step
 * @param data
 * @param options
 */
export const removeStep = async (
  data: {
    stepId: number;
    caseId?: number | string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/remove', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};
/**
 * 删除公共step
 * @param body
 * @param options
 */
export const removeCommonStep = async (
  body: { stepId: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/api/ui/case/step/removeCommon', {
    method: 'POST',
    data: body,
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

/**
 * step 详情
 * @param data
 * @param options
 */
export const reOrderStep = async (
  data: {
    caseId: string;
    stepIds: number[];
  },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseSteps>>('/api/ui/case/step/order', {
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
export const copyStep = async (
  data: {
    caseId?: string | number;
    stepId: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseSteps>>('/api/ui/case/step/copy', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 前后置APi 添加
 * @param data
 * @param options
 */
export const addUIStepApi = async (data: IUICaseStepAPI, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/step/api/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置APi 修改
 * @param data
 * @param options
 */
export const editUIStepApi = async (
  data: IUICaseStepAPI,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/api/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置APi 删除
 * @param data
 * @param options
 */
export const removeUIStepApi = async (
  data: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/api/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置APi 查询
 * @param data
 * @param options
 */
export const detailUIStepApi = async (
  data: { stepId: number },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseStepAPI>>('/api/ui/case/step/api/detail', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

/**
 * 前后置SQL 添加
 * @param data
 * @param options
 */
export const addUIStepSql = async (data: IUICaseStepSQL, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/step/sql/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置SQL 添加
 * @param data
 * @param options
 */
export const editUIStepSql = async (
  data: IUICaseStepSQL,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/sql/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置SQL 删除
 * @param data
 * @param options
 */
export const removeUIStepSql = async (
  data: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/sql/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 前后置SQL 详情
 * @param params
 * @param options
 */
export const detailUIStepSql = async (
  params: { stepId: number },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseStepSQL>>('/api/ui/case/step/sql/detail', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

/**
 * 条件判断
 * @param data
 * @param options
 */
export const addStepCondition = async (
  data: IUICaseStepCondition,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/condition/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 条件判断更新
 * @param data
 * @param options
 */
export const updateStepCondition = async (
  data: IUICaseStepCondition,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/condition/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 条件判断删除
 * @param data
 * @param options
 */
export const removeStepCondition = async (
  data: { stepId: number },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/condition/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 条件详情
 */
export const detailStepCondition = async (
  stepId: number,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/condition/add', {
    method: 'GET',
    params: { stepId: stepId },
    ...(options || {}),
  });
};

/**
 * 条件添加子步骤
 * @param data
 * @param options
 */
export const addSubStep = async (data: IUICaseSubStep, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/case/step/sub/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 条件添加子步骤
 * @param data
 * @param options
 */
export const updateSubStep = async (
  data: IUICaseSubStep,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/case/step/sub/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 条件查询步骤
 */

export const querySubSteps = async (
  params: { stepId: number },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseSubStep[]>>('/api/ui/case/step/sub/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

/**
 * 条件步骤排序
 */

export const orderSubSteps = async (
  data: { stepId: number; subIds: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<IUICaseSubStep[]>>('/api/ui/case/step/sub/reorder', {
    method: 'post',
    data,
    ...(options || {}),
  });
};

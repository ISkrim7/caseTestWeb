import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IUITask } from '@/pages/Play/componets/uiTypes';
import { request } from '@@/plugin-request';

/**
 * task 分页
 * @param params
 * @param options
 */
export const pageUICaseTask = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUITask>>>('/api/ui/task/page', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

/**
 * 启动关闭任务
 * @param data
 * @param opt
 */
export const setUITaskSwitch = async (
  data: { jobId: string; switch: boolean },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>('/api/ui/task/job/setSwitch', {
    method: 'POST',
    data,
    ...opt,
  });
};

/**
 * 下次运行时间
 * @param body
 * @param options
 */
export const getTaskJobNextRunTime = async (
  body: { jobId: string },
  options?: IObjGet,
) => {
  return request<IResponse<string>>('/api/ui/task/job/nextRunTime', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

/**
 * 删除任务
 * @param data
 * @param options
 */
export const delCaseTaskByUid = async (
  data: { taskId: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUITask>>('/api/ui/task/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
/**
 * 任务详情
 * @param data
 * @param options
 */
export const getTaskById = async (
  data: { taskId: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUITask>>('/api/ui/task/detail', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

/**
 * 添加任务
 * @param body
 * @param options
 */
export const newUITask = async (body: IUITask, options?: IObjGet) => {
  return request<IResponse<IUITask>>('/api/ui/task/insert', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 修改任务
 * @param body
 * @param options
 */
export const updateUITask = async (body: IUITask, options?: IObjGet) => {
  return request<IResponse<null>>('/api/ui/task/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 用例重新排序
 * @param data
 * @param options
 */
export const reorderAssociationUICasesByTaskId = async (
  data: { taskId: string | number; caseIdList: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/task/association/reorder', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 查询关联用例
 * @param data
 * @param options
 */
export const queryAssociationUICasesByTaskId = async (
  data: { taskId: string | number },
  options?: IObjGet,
) => {
  return request<IResponse<IUITask[]>>('/api/ui/task/query/case', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};
/**
 * 查询关联用例
 * @param data
 * @param options
 */
export const removeAssociationUICasesByTaskId = async (
  data: { taskId: string | number; caseId: number },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/task/association/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
/**
 * 关联Cases
 * @param data
 * @param options
 */
export const associationUICasesByTaskId = async (
  data: { taskId: string | number; caseIdList: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/task/association/case', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 手动执行任务
 * @param data
 * @param options
 */
export const handelExecuteTask = async (
  data: { taskId: number | string },
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/ui/task/execute/handle', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

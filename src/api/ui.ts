import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { UIMultipleReport } from '@/pages/Report/uiReport';
import {
  IUICase,
  IUICaseSteps,
  IUIEnv,
  IUIMethod,
  IUIResult,
  IUITask,
} from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request/request';

const MethodOptions: string = '/api/ui_case/method/option';
const StepOptions: string = '/api/ui_case/common/step/option';
const UICaseOptions: string = '/api/ui_case/option';
const HandelRunCase: string = '/api/ui_case/handelRunByUid';
const HandelCaseSteps: string = '/api/ui_case/caseStepOption';
const QueryStepByCaseId: string = '/api/ui_case/queryStepsByCaseId';
const CaseStepOrder: string = '/api/ui_case/caseStepOrder';
const PageResult: string = '/api/ui_case/pageCaseResults';
const GetResultByUid: string = '/aps/ui/case/case_result_detail';
const UICaseTaskOption: string = '/api/ui_case/task/option';
const NewUITask: string = '/aps/ui/task/newTask';
const UpdateUITask: string = '/aps/ui/task/updateTask';
const AddTaskUICase: string = '/aps/ui/task/addUICase';
const TaskDetailInfo = '/aps/ui/task/taskDetail';
const RemoveTaskUICase: string = '/aps/ui/task/removeUICase';
const UICaseTaskPage: string = '/aps/ui/task/pageTask';
const CopyCase: string = '/api/ui_case/copy';
const QueryCasesByTaskId: string = '/api/ui_case/task/cases';
const pageUICaseByTaskID: string = '/aps/ui/task/pageUICase';
const PageReportByTaskId: string = '/api/ui_case/task/pageTaskReport';
const GetMultipleReportByTaskId: string = '/api/ui_case/task/baseInfo';
const QueryMultipleReportDetailByBaseId: string =
  '/api/ui_case/task/base/queryDetail';
const SetUITaskSwitchURL: string = '/aps/ui/task/job/setSwitch';
const EnvOptions: string = '/api/ui_case/env/option';

const AddCommonUIStep = '/aps/ui/case/step/addCommonStep';

/**
 * 用例添加group step
 */

export const caseAddStepWithGroup = async (
  body: {
    caseId: number;
    groupIds: number[];
  },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/aps/ui/case/add/groupStep', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 删除group step
 */
export const removeGroupStepById = async (
  body: { stepId: number; groupId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/aps/ui/step/group/removeStep', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 通过group 查询steps
 */

export const queryStepsByGroupId = async (
  params: { groupId: number },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>('/aps/ui/step/group/querySteps', {
    method: 'GET',
    params,
    ...(opt || {}),
  });
};

/**
 * 给group 添加step
 */
export const addStepToGroup = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/newStep', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 给group 添加step
 */
export const orderStepToGroup = async (
  data: { groupId: number; stepList: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/orderStep', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 添加用例分组
 * @param data
 * @param options
 */
export const addStepGroup = async (
  data: {
    name: string;
    desc: string;
    creator: number;
    creatorName: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 删除用例分组
 * @param data
 * @param options
 */
export const delStepGroup = async (
  data: {
    id: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/delete', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 更新用例分组信息
 * @param data
 * @param options
 */
export const putStepGroup = async (
  data: {
    uid: string;
    name: string;
    desc: string;
    updater: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const pageStepGroup = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<any>>>('/aps/ui/step/group/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const queryStepByGroupID = async (
  params: { groupId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/aps/ui/step/group/querySteps', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const addCommonUIStep = async (
  body: IUICaseSteps,
  options?: IObjGet,
) => {
  return request<IResponse<any>>(AddCommonUIStep, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const queryMultipleReportDetailByBaseId = async (
  params: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(QueryMultipleReportDetailByBaseId, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const pageUITaskReport = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<any>>>('/aps/ui/report/page/taskResult', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};
export const pageUICaseByTaskId = async (params: ISearch, opt?: IObjGet) => {
  return request<IResponse<IPage<IUICase>>>(pageUICaseByTaskID, {
    method: 'GET',
    params,
    ...(opt || {}),
  });
};

export const getMultipleReportByTaskId = async (
  params: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<UIMultipleReport>>(GetMultipleReportByTaskId, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};
export const pageUICaseTask = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUITask>>>(UICaseTaskPage, {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

export const newCaseTask = async (body: IUITask, options?: IObjGet) => {
  return request<IResponse<string>>(NewUITask, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const updateCaseTask = async (body: IUITask, options?: IObjGet) => {
  return request<IResponse<string>>(UpdateUITask, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const addTaskCase = async (
  body: { taskUid: string; caseIdList: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(AddTaskUICase, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const removeTaskCase = async (
  body: { taskId: number; caseId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(RemoveTaskUICase, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const getCaseTaskByUid = async (
  params: { taskUid: string },
  method: string,
  options?: IObjGet,
) => {
  return request<IResponse<IUITask>>(TaskDetailInfo, {
    method,
    params,
    ...(options || {}),
  });
};
export const delCaseTaskByUid = async (
  data: { taskId: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUITask>>('/aps/ui/task/removeTask', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const queryMethodOptions = async (options?: IObjGet) => {
  return request<IResponse<IUIMethod[]>>(MethodOptions, {
    method: 'GET',
    ...(options || {}),
  });
};

export const addMethod = async (
  body: { label: string; value: string; desc?: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(MethodOptions, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const delMethod = async (body: { id: number }, options?: IObjGet) => {
  return request<IResponse<any>>(MethodOptions, {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
};

export const pageStepOptions = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<any>>('/aps/ui/case/step/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const saveStep = async (body: IUICaseSteps, options?: IObjGet) => {
  return request<IResponse<any>>(StepOptions, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const delCommonStep = async (
  body: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/aps/ui/case/step/delStep', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const putStep = async (body: IUICaseSteps, options?: IObjGet) => {
  return request<IResponse<any>>('/aps/ui/case/step/putStep', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const addUICase = async (body: IUICase, options?: IObjGet) => {
  return request<IResponse<any>>(UICaseOptions, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const putUICase = async (body: IUICase, options?: IObjGet) => {
  return request<IResponse<any>>(UICaseOptions, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
};

export const delUICase = async (body: { uid: string }, options?: IObjGet) => {
  return request<IResponse<any>>(UICaseOptions, {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
};
export const getUICase = async (params: { id: string }, options?: IObjGet) => {
  return request<IResponse<IUICase>>(UICaseOptions, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const queryStepByCaseId = async (
  params: { id: string },
  options?: IObjGet,
): Promise<IResponse<IUICaseSteps[]>> => {
  return request<IResponse<IUICaseSteps[]>>('/aps/ui/case/step/query', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};
export const copyCase = async (body: { uid: string }, options?: IObjGet) => {
  return request<IResponse<any>>(CopyCase, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const handelRunCase = async (
  body: { id: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(HandelRunCase, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const pageResult = async (
  params: ISearch,
  options?: IObjGet,
): Promise<IResponse<any>> => {
  return request<IResponse<IPage<IUIResult[]>>>(PageResult, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const getResultByUid = async (
  params: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUIResult>>(GetResultByUid, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const handelCaseSteps = async (
  body: any,
  method: 'POST' | 'PUT' | 'DELETE',
  options?: IObjGet,
) => {
  return request<IResponse<any>>(HandelCaseSteps, {
    method: method,
    data: body,
    ...(options || {}),
  });
};

export const orderCaseSteps = async (
  body: { caseId: string; steps: number[] },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(CaseStepOrder, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const setUITaskSwitch = async (
  data: { uid: string; switch: boolean },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>(SetUITaskSwitchURL, {
    method: 'POST',
    data,
    ...opt,
  });
};

export const fetchEnvsOptions = async (
  method: string,
  data?: IUIEnv | { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<IUIEnv[]>>(EnvOptions, {
    method: method,
    data: data,
    ...(options || {}),
  });
};

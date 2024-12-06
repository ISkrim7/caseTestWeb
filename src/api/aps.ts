import { ICasePart, IObjGet, IPage, IResponse, ISearch } from '@/api';
import {
  IUICase,
  IUICaseStepAPI,
  IUIExtract,
} from '@/pages/UIPlaywright/uiTypes';
import { request } from '@@/plugin-request/request';

const QueryProjects = '/aps/project/query';
const QueryRootCasePartByProjectId = '/aps/part/queryRootPartByProjectId';
const CountByProjectID = '/aps/ui/case/countByProjectId';
const QueryVariablesByCaseID = '/aps/ui/case/variable/page';
const DeleteVariableByCaseID = '/aps/ui/case/variable/delete';
const AddVariableByID = '/aps/ui/case/variable/add';
const PutVariableByID = '/aps/ui/case/variable/update';
const CountByDate = '/aps/ui/case/countByDate';
const QueryRootParts = '/aps/part/queryRootPartByProjectId';
const GetTaskStatusByRootPartId = '/aps/ui/task/getTaskStatusByPart';
const HandelRunCase = '/aps/ui/case/executeCaseById';
const HandelRunTask = '/aps/ui/task/runTask';
const AddTaskAPSJOB = '/aps/ui/task/addJob';
const UpdateTaskAPSJOB = '/aps/ui/task/updateJob';
const RemoveTaskAPSJOB = '/aps/ui/task/removeJob';
const APSNextRunTime = '/aps/ui/task/job/nextRunTime';
const SetAPSJobSwitch = '/aps/ui/task/job/setSwitch';

const PageUICase = '/aps/ui/case/page';

const AddUICaseStepApi = '/aps/ui/case/add/stepApi';
const AddUICaseStepSQL = '/aps/ui/case/add/stepSQL';
const UpdateUICaseStepApi = '/aps/ui/case/update/stepApi';
const UpdateUICaseStepSql = '/aps/ui/case/update/stepSql';
const DeleteUICaseStepApi = '/aps/ui/case/delete/stepApi';
const DeleteUICaseStepSQL = '/aps/ui/case/delete/stepSql';
const GetUICaseStepApiInfo = '/aps/ui/case/stepAPIInfo';
const GetUICaseStepSQLInfo = '/aps/ui/case/stepSQLInfo';
const ClearUIResult = '/aps/ui/case/clear_result';

export const clearUICaseResult = async (
  data: { caseId: number },
  options?: IObjGet,
) => {
  return request(ClearUIResult, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

export const deleteUICaseStepApi = async (
  data: { uid: string },
  options?: IObjGet,
) => {
  return request(DeleteUICaseStepApi, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const deleteUICaseStepSql = async (
  data: { uid: string },
  options?: IObjGet,
) => {
  return request(DeleteUICaseStepSQL, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
export const getUICaseStepAPIInfo = async (
  data: { stepId: number },
  options?: IObjGet,
) => {
  return request(GetUICaseStepApiInfo, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};

export const getUICaseStepSQLInfo = async (
  data: { stepId: number },
  options?: IObjGet,
) => {
  return request(GetUICaseStepSQLInfo, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};
export const addUICaseStepApi = async (
  data: IUICaseStepAPI,
  options?: IObjGet,
) => {
  return request(AddUICaseStepApi, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const addUIStepSQL = async (data: any, options?: IObjGet) => {
  return request(AddUICaseStepSQL, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
export const updateUICaseStepApi = async (
  data: IUICaseStepAPI,
  options?: IObjGet,
) => {
  return request(UpdateUICaseStepApi, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};
export const updateUICaseStepSQL = async (data: any, options?: IObjGet) => {
  return request(UpdateUICaseStepSql, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const pageUICase = async (params: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IUICase>>>(PageUICase, {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

export const setJob = async (
  body: { jobId: string; switch: boolean },
  options?: IObjGet,
) => {
  return request<IResponse<string>>(SetAPSJobSwitch, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const getTaskJobNextRunTime = async (
  body: { jobId: string },
  options?: IObjGet,
) => {
  return request<IResponse<string>>(APSNextRunTime, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const addTaskJob = async (
  body: { taskId: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(AddTaskAPSJOB, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const updateTaskJob = async (
  body: { taskId: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(UpdateTaskAPSJOB, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const removeTaskJob = async (
  body: { jobId: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(RemoveTaskAPSJOB, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const handelAPSRunCase = async (
  body: { caseId: number; userId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(HandelRunCase, {
    method: 'POST',
    params: body,
    ...(options || {}),
  });
};

export const handelAPSRunTask = async (
  body: { taskId: number; userId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(HandelRunTask, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const queryProjects = async (options?: IObjGet) => {
  return request<IResponse<any>>(QueryProjects, {
    method: 'GET',
    ...(options || {}),
  });
};

export const queryRootCasePartByProjectId = async (
  body: { projectId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(QueryRootCasePartByProjectId, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const caseCountByProjectId = async (
  body: { projectId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(CountByProjectID, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const countCaseByDateType = async (
  body: { projectId: number; st?: string; et?: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(CountByDate, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
};

export const queryRootPartsByProjectId = async (
  params: { projectId: number },
  options?: IObjGet,
) => {
  return request<IResponse<ICasePart[]>>(QueryRootParts, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const getTaskStatusByRootPartId = async (
  params: { partId: number; st?: string; et?: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(GetTaskStatusByRootPartId, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const queryUIVariablesByCaseId = async (
  params: { caseId: number },
  options?: IObjGet,
) => {
  return request<IResponse<IPage<IUIExtract>>>(QueryVariablesByCaseID, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const deleteUIVariableById = async (
  data: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(DeleteVariableByCaseID, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

export const addUIVariableById = async (
  data: { key: string; value: string; caseId: number; creator: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(AddVariableByID, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

export const putUIVariableById = async (
  data: {
    uid: string;
    key: string;
    value: string;
    caseId: number;
    updater: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(PutVariableByID, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

export const addApsWsJob = async (
  data: { task_id?: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/api/task/job1', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

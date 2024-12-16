import {
  ICasePart,
  IGroupInterfaceDataSource,
  IGroupInterfacesResult,
  IObjGet,
  IPage,
  IQueryPartTree,
  IQueryProjectVariable,
  IResponse,
  ISearch,
} from '@/api';
import {
  IInterface,
  IInterfaceTask,
  InterfaceResponse,
} from '@/pages/Httpx/types';
import { request } from '@@/plugin-request/request';
import React from 'react';

const CasePartTreeUrl: string = '/api/case/part/query';
const CasePartOptUrl: string = '/api/case/part/opt';
const DropCasePart = '/api/case/part/drop';

const CaseAPIOptURl: string = '/api/interface/interface/opt';
const QueryCaseAPIByCasePartID: string = '/api/case/part/interfaces';
const PageCaseAPI = '/api/interface/interface/page';
const CopyInterface = '/api/interface/interface/copy';
const TryApiRL = '/api/interface/interface/try';
const RunApiURL = '/api/interface/interface/run';
const RunApisURL = '/api/interface/interfaces/run';
const PageApisResultURL = '/api/interface/interfaces/result/page';
const PageApiResultURL = '/api/interface/interface/result/page';
const GetApiResponseURL = '/api/interface/interface/response';
const GetApiGroupDetail = '/api/interface/interfaces/group/detail';
const GetInterfacesResultInfoURL = '/api/interface/interfaces/report/info';
const QueryInterfacesGroupInfo = '/api/interface/interfaces/query/results';
const HandleRunTask = '/api/interface/interfaceTask/handleStart';
const GetInterfaceStepVariables = '/api/interface/interface/variables';
const AddInterfaceTask = '/api/interface/interfaceTask/insert';
const UpdateInterfaceTask = '/api/interface/interfaceTask/update';
const InterfaceTaskDetail = '/api/interface/interfaceTask/detail';
const QueryInterfaceTaskByTaskId =
  '/api/interface/interfaceTask/queryInterfacesByTaskId';
const DelInterfaceTask = '/api/interface/interfaceTask/delete';
const PageInterfaceTask = '/api/interface/interfaceTask/page';
const SocketTest = '/api/interface/socket';
const SetTaskSwitchURL = '/api/interface/interfaceTask/switch';
const VariableOpt = '/api/interface/variable/opt';
const VariablePage = '/api/interface/variable/page';

interface ICopyInterface {
  uid: string;
}

/**
 * 复制接口
 * @param body
 * @param opt
 */
export const copyInterface = async (body: ICopyInterface, opt?: IObjGet) => {
  return request<IResponse<string>>(CopyInterface, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
};

/***
 * 通过项目ID获取全局变量
 * @param params
 * @param options
 * @constructor
 */

export interface IGetVariableOpt {
  projectId: number; //projectID
}

export async function QueryVariableOpt(
  params?: IGetVariableOpt,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<IQueryProjectVariable[]>>(VariableOpt, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/**
 * 全局变量分页
 * @param params
 * @param options
 * @constructor
 */
export async function PageVariable(params: ISearch, options?: IObjGet) {
  return request<IResponse<IPage<any>>>(VariablePage, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export interface IPutVariableOpt {
  uid: string;
  key?: string;
  value?: string;
  desc?: string;
  projectId?: number;
}

export async function PutVariable(
  data?: IPutVariableOpt,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<IQueryProjectVariable[]>>(VariableOpt, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export interface IPostVariableOpt {
  key: string;
  value: string;
  desc: string;
  projectId: number;
}

export async function PostVariable(
  data?: IPostVariableOpt,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<IQueryProjectVariable[]>>(VariableOpt, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function DelVariable(
  data?: {
    uid: string;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<IQueryProjectVariable[]>>(VariableOpt, {
    method: 'delete',
    data,
    ...(options || {}),
  });
}

interface ICasePartTree {
  projectID: number;
}

export async function casePartTree(params?: ICasePartTree, options?: IObjGet) {
  return request<IResponse<IQueryPartTree[]>>(CasePartTreeUrl, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/**
 * 添加casePart
 * @param body
 * @param options
 */
export async function addCasePart(
  body: ICasePart,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<any>>(CasePartOptUrl, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function putCasePart(
  body: ICasePart,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<any>>(CasePartOptUrl, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function delCasePart(
  body: {
    id: number;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<any>>(CasePartOptUrl, {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
}

export async function addApiCase(body: IInterface, options?: IObjGet) {
  return request<IResponse<any>>(CaseAPIOptURl, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

interface queryApiCaseByCasePartIDParams {
  casePartID: number;
}

export async function queryApiCaseByCasePartID(
  params: queryApiCaseByCasePartIDParams,
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<any>>(QueryCaseAPIByCasePartID, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

interface delApiCaseBody {
  uid: string;
}

export async function delApiCase(body: delApiCaseBody, options?: IObjGet) {
  return request<IResponse<any>>(CaseAPIOptURl, {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
}

export async function delTask(body: delApiCaseBody, options?: IObjGet) {
  return request<IResponse<any>>(DelInterfaceTask, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export const setInterTaskSwitch = async (
  data: { uid: string; switch: boolean },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>(SetTaskSwitchURL, {
    method: 'POST',
    data,
    ...opt,
  });
};

export async function pageApiCase(params: ISearch, options?: IObjGet) {
  return request<IResponse<IPage<IInterface>>>(PageCaseAPI, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export async function tryApi(body: any, options?: IObjGet) {
  return request<IResponse<any>>(TryApiRL, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

interface DetailParams {
  uid: string;
  withStructureLog?: boolean;
}

export async function getApiDetail(params: DetailParams, options?: IObjGet) {
  return request<IResponse<IInterface>>(CaseAPIOptURl, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function putApi(params: IInterface, options?: IObjGet) {
  return request<IResponse<null>>(CaseAPIOptURl, {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

export const runApi = async (body: DetailParams, options?: IObjGet) => {
  return request<IResponse<string>>(RunApiURL, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const getApiResponse = async (
  params: DetailParams,
  options?: IObjGet,
) => {
  return request<IResponse<InterfaceResponse>>(GetApiResponseURL, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const getGroupDetail = async (
  params: DetailParams,
  options?: IObjGet,
) => {
  return request<IResponse<InterfaceResponse>>(GetApiGroupDetail, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export async function runInterfaceGroup(
  data: { interfaceIds: string[] },
  options?: {
    [key: string]: any;
  },
) {
  return request<IResponse<any>>(RunApisURL, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/**
 * 单个构建历史分页
 * @param params
 * @param options
 */
export const pageInterfaceResult = async (
  params: ISearch,
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>(PageApiResultURL, {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

/**
 * 多个构建历史分页
 * @param params
 * @param options
 */
export const pageInterfacesResult = async (
  params: ISearch,
  options?: IObjGet,
) => {
  return request<IResponse<IPage<any>>>(PageApisResultURL, {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

export const getInterfacesResultInfo = async (
  params: {
    uid: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IGroupInterfacesResult>>(
    GetInterfacesResultInfoURL,
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
};

export const queryInterfacesGroupInfo = async (
  params: {
    interfaceGroupId: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IGroupInterfaceDataSource[]>>(
    QueryInterfacesGroupInfo,
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
};

export async function socketTest(options?: { [key: string]: any }) {
  return request<IResponse<any>>(SocketTest, {
    method: 'GET',
    ...(options || {}),
  });
}

export const getInterfaceStepVariables = async (
  params: {
    interfaceId: string;
    step: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<{ key: string; value?: any }[]>>(
    GetInterfaceStepVariables,
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
};

export const addInterfaceTask = async (body: IInterfaceTask, opt?: IObjGet) => {
  return request<IResponse<any>>(AddInterfaceTask, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
};
export const updateInterfaceTask = async (
  body: IInterfaceTask,
  opt?: IObjGet,
) => {
  return request<IResponse<any>>(UpdateInterfaceTask, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
};
export const pageInterfaceTask = async (params: any, opt?: IObjGet) => {
  return request<IResponse<IPage<any>>>(PageInterfaceTask, {
    method: 'GET',
    params,
    ...(opt || {}),
  });
};

export const dropCasePart = async (
  body: {
    id: React.Key;
    targetId: React.Key | null;
  },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>(DropCasePart, {
    method: 'POST',
    data: body,
    ...opt,
  });
};
export const getInterfaceTaskDetail = async (
  params: {
    uid: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceTask>>(InterfaceTaskDetail, {
    method: 'GET',
    params: params,
    ...options,
  });
};
export const queryInterfacesByTaskId = async (
  params: {
    taskId: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<IInterface[]>>(QueryInterfaceTaskByTaskId, {
    method: 'GET',
    params: params,
    ...options,
  });
};

export const handelRunTask = async (
  params: {
    uid: string;
  },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(HandleRunTask, {
    method: 'POST',
    data: params,
    ...options,
  });
};

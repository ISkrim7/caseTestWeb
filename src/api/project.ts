import {
  INewOrUpdateProject,
  IObjGet,
  IProject,
  IResponse,
  ISearch,
} from '@/api';
import { request } from '@@/plugin-request/request';

const ProjectURL: string = '/api/project/opt';
const ProjectDetail: string = '/api/project/detail';
const QueryProjectURL: string = '/api/project/queryProjects';
const AddUser2ProjectURL: string = '/api/project/addUser';
const DelUserFromProjectURl: string = '/api/project/user/del';
const ProjectInfoURL: string = '/api/project/info';
const ProjectUsersURL: string = '/api/project/users';

export async function projectDetail(params: { id: string }, options?: IObjGet) {
  return request<IResponse<any>>(ProjectDetail, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/** 项目 GET /project */
export async function pageProject(params?: ISearch, options?: IObjGet) {
  return request<IResponse<any>>(ProjectURL, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export async function queryProject(options?: IObjGet) {
  return request<IResponse<IProject[]>>(QueryProjectURL, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 项目 rud
 * @param data 请求参数
 * @param method 请求方法
 * @param options 其他配置
 */
export async function projectOpt(
  data: INewOrUpdateProject | { uid: string },
  method: string,
  options?: IObjGet,
) {
  return request<IResponse<any>>(ProjectURL, {
    method: method,
    data: data,
    ...(options || {}),
  });
}

/**
 * 项目详情
 * @param data uid
 * @param options
 */
export async function projectDetailInfo(data: IProject, options?: IObjGet) {
  return request<IResponse<any>>(ProjectInfoURL, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
}

export async function queryProjectUsers(data: IProject, options?: IObjGet) {
  return request<IResponse<any>>(ProjectUsersURL, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
}

export async function addUser2Project(
  data: { uid: string; userIds: number[] },
  options?: IObjGet,
) {
  return request<IResponse<any>>(AddUser2ProjectURL, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function delUserFromProjectFetch(
  data: { uid: string; projectID: string },
  options?: IObjGet,
) {
  return request<IResponse<any>>(DelUserFromProjectURl, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

import {
  ICasePart,
  IEnv,
  ILoginParams,
  IObjGet,
  IProject,
  IQueryPartTree,
  IResponse,
  ISearch,
  IUser,
} from '@/api';
import { request } from '@@/plugin-request/request';

/** 登录接口 POST /user/login */
export async function login(body: ILoginParams, options?: IObjGet) {
  return request<IResponse<any>>('/api/user/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /user/current */
export async function currentUser(options?: IObjGet) {
  return request<{ data: IUser }>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 模糊搜索用户 GET /users */
export async function searchUser(
  params: { username: string },
  options?: IObjGet,
) {
  return request<IResponse<IUser[]>>('/api/user/query_by_username', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/**
 * 项目分页
 */
export const pageProject = async (params?: ISearch, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/page', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

/**
 * 项目query
 */
export const queryProject = async (options?: IObjGet) => {
  return request<IResponse<IProject[]>>('/api/project/query', {
    method: 'GET',
    ...(options || {}),
  });
};

/**
 * 添加项目
 */
export const newProject = async (data?: IProject, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/insert', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 修改项目
 */
export const putProject = async (data?: IProject, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 添加env
 * @param data
 * @param options
 */
export const insertEnv = async (data: IEnv, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/env/insert', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * env 分页
 * @param params
 * @param options
 */
export const pageEnv = async (params?: ISearch, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/env/page', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
};

/**
 * env query
 * @param options
 */
export const queryEnv = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/env/page', {
    method: 'GET',
    ...(options || {}),
  });
};
/**
 * env 修改
 * @param envInfo
 * @param options
 */
export const updateEnv = async (envInfo: IEnv, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/env/update', {
    method: 'POST',
    data: envInfo,
    ...(options || {}),
  });
};
/**
 * env 删除
 * @param envInfo
 * @param options
 */
export const deleteEnv = async (envInfo: IEnv, options?: IObjGet) => {
  return request<IResponse<any>>('/api/project/env/remove', {
    method: 'POST',
    data: envInfo,
    ...(options || {}),
  });
};

/**
 * env 查询
 * @param envInfo
 * @param options
 */
export const queryEnvBy = async (envInfo: IEnv, options?: IObjGet) => {
  return request<IResponse<IEnv[]>>('/api/project/env/queryBy', {
    method: 'GET',
    params: envInfo,
    ...(options || {}),
  });
};

/**
 * 通过project 获取模块树
 * @param projectId
 * @param options
 */
export const queryTreePartByProject = async (
  projectId: number,
  options?: IObjGet,
) => {
  return request<IResponse<IQueryPartTree[]>>('/api/part/queryTreeByProject', {
    method: 'GET',
    params: { projectId: projectId },
    ...(options || {}),
  });
};

/**
 * 添加casePart
 * @param body
 * @param options
 */
export const insertCasePart = async (body: ICasePart, options?: IObjGet) => {
  return request<IResponse<any>>('/api/part/insert', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 修改casePart
 * @param body
 * @param options
 */
export const putCasePart = async (body: ICasePart, options?: IObjGet) => {
  return request<IResponse<any>>('/api/part/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

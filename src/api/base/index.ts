import {
  IEnv,
  ILoginParams,
  IModule,
  IObjGet,
  IProject,
  IResponse,
  ISearch,
  IUser,
} from '@/api';
import { IUITask } from '@/pages/Play/componets/uiTypes';
import { request } from '@@/plugin-request/request';
import React from 'react';

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

/** 删除用户  /user/current */
export async function removeUser(userId: number, options?: IObjGet) {
  return request<IResponse<null>>('/api/user/remove', {
    method: 'POST',
    data: { userId: userId },
    ...(options || {}),
  });
}

/** 删除用户  /user/current */
export async function updateUser(user: IUser, options?: IObjGet) {
  return request<IResponse<null>>('/api/user/update', {
    method: 'POST',
    data: user,
    ...(options || {}),
  });
}

export async function publicRegister(
  userData: {
    username: string;
    password: string;
    gender: number; // 1(MALE) 或 0(FEMALE)
    phone: string;
  },
  options?: IObjGet,
) {
  return request<IResponse<any>>('/api/user/public/register', {
    method: 'POST',
    data: userData, // 直接传递整个对象，更简洁
    ...(options || {}),
  });
}

/** 删除用户  /user/current */
export async function registerUser(user: IUser, options?: IObjGet) {
  return request<IResponse<null>>('/api/user/registerUser', {
    method: 'POST',
    data: user,
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
  return request<IResponse<IEnv[]>>('/api/project/env/query', {
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
 * @param moduleType
 * @param options
 */
export const queryTreeModuleByProject = async (
  projectId: number,
  moduleType: number,
  options?: IObjGet,
) => {
  return request<IResponse<IModule[]>>('/api/module/queryTreeByProject', {
    method: 'GET',
    params: { project_id: projectId, module_type: moduleType },
    ...(options || {}),
  });
};

/**
 * 添加 module
 * @param body
 * @param options
 */
export const insertModule = async (
  body: {
    title: string;
    project_id: number;
    module_type: number;
    parent_id?: number;
  },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/api/module/insert', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
/**
 * 添加 module
 * @param body
 * @param options
 */
export const updateModule = async (
  body: { title: string; id: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/api/module/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

/**
 * 添加 module
 * @param body
 * @param options
 */
export const removeModule = async (
  body: { moduleId: number },
  options?: IObjGet,
) => {
  return request<IResponse<any>>('/api/module/remove', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const dropModule = async (
  body: {
    id: React.Key;
    targetId: React.Key | null;
    new_order?: number;
  },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>('/api/module/drop', {
    method: 'POST',
    data: body,
    ...opt,
  });
};

/**
 * page user
 * @param searchInfo
 * @param options
 */
export const pageUsers = async (searchInfo: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/user/pageUser', {
    method: 'POST',
    data: searchInfo,
    ...(options || {}),
  });
};

export async function userUpdatePwd(
  data: {
    new_password?: string;
    old_password?: string;
  },
  options?: IObjGet,
) {
  return request<IResponse<any>>('/api/user/updatePwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: data,
    ...(options || {}),
  });
}

export const uploadAvatar = async (file: any, options?: IObjGet) => {
  return request<IResponse<any>>('/api/user/uploadAvatar', {
    method: 'POST',
    data: file,
    requestType: 'form',
    ...(options || {}),
  });
};

/**
 * 查看任务
 * @param opt
 */
export const allJobs = async (opt?: IObjGet) => {
  return request<IResponse<IUITask[]>>('/api/aps/job/list', {
    method: 'GET',
    ...opt,
  });
};

/**
 * 查看任务
 * @param opt
 */
/**
 * 启动关闭任务
 * @param data
 * @param opt
 */
export const setSwitch = async (
  data: { tag: string; uid: string; switch: boolean },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>('/api/aps/job/set_switch', {
    method: 'POST',
    data,
    ...opt,
  });
};

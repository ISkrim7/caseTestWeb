import {
  IDepartment,
  IDepartmentPage,
  IDepartmentResponse,
  IMoHuSearchUser,
  IObjGet,
  IPassword,
  IResponse,
  ISearch,
  IUser,
} from '@/api';
import { request } from '@@/plugin-request/request';

const UserURL: string = '/api/user/opt';
const UserPwdURL: string = '/api/user/setpassword';
const UserAvatarURL: string = '/api/file/avatar';
const DepartmentTagsURl: string = '/api/user/department/tags';
const PageDepartmentURL: string = '/api/user/department/page';
const DepartmentOptURL: string = '/api/user/department/opt';

const QueryUser: string = '/api/user/query';
const SearchUser: string = '/api/user/search';
const CurrentUser: string = '/api/user/current';

/** 模糊搜索用户 GET /users */
export async function searchUser(body: IMoHuSearchUser, options?: IObjGet) {
  return request<{ data: IUser[] }>(SearchUser, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** user GET /user */
export async function pageUser(params: ISearch, options?: IObjGet) {
  return request<IResponse<any>>(QueryUser, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/**
 * 用户crud
 * @param data
 * @param method
 * @param options
 * @constructor
 */
export async function UserOpt(method: string, data?: IUser, options?: IObjGet) {
  return request<IResponse<any>>(UserURL, {
    method: method,
    data: data,
    ...(options || {}),
  });
}

export async function SetPwdServer(data: IPassword, options?: IObjGet) {
  return request<IResponse<any>>(UserPwdURL, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/**
 * 部门查询
 * @param params
 * @param options
 */
export async function departmentPage(params?: ISearch, options?: IObjGet) {
  return request<IResponse<IDepartmentPage>>(PageDepartmentURL, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function departmentQuery(method: string, options?: IObjGet) {
  return request<IResponse<IDepartment[]>>(DepartmentOptURL, {
    method: method,
    ...(options || {}),
  });
}

export async function departmentOpt(
  form: IDepartment,
  method: string,
  options?: IObjGet,
) {
  return request<IResponse<IDepartmentResponse[]>>(DepartmentOptURL, {
    method: method,
    data: form,
    ...(options || {}),
  });
}

/**
 * tag
 * @param params
 * @param options
 * @constructor
 */

export async function userTagQuery(params: IObjGet, options?: IObjGet) {
  return request<IResponse<any>>(DepartmentTagsURl, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function uploadAvatar(file: any, options?: IObjGet) {
  return request<IResponse<any>>(UserAvatarURL, {
    method: 'POST',
    data: file,
    requestType: 'form',
    ...(options || {}),
  });
}

import { IObjGet, IResponse, ISearch } from '@/api';
import { request } from '@@/plugin-request/request';

const USER_LEAVE = '/api/cbs/modify/userLevel';
const MODIFY_SUBMIT = '/api/cbs/modify/submit';
const USER_WHITE = '/api/cbs/modify/setUserWhite';
const PAGE_MODIFY_INFO = '/api/cbs/modify/page';
const PAGE_MODIFY_DETAIL = '/api/cbs/modify/detail';

export interface IUserLeaveModify {
  city: string;
  username: string;
  buy_houseId?: string;
  buy_houseJobs?: number[];
  lease_houseId?: string;
  lease_houseJobs: number[];
  intention?: boolean;
}

/**
 * 人离职异动
 * @param body
 * @param opt
 */
export async function userLeaveModify(body: IUserLeaveModify, opt?: IObjGet) {
  return request<IResponse<any>>(USER_LEAVE, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
}

interface IModify {
  data_info: string;
  modify_type: string;
  comp_name: string;
  dest_info?: string;
}

export const modifySubmit = async (body: IModify, opt?: IObjGet) => {
  return request<IResponse<any>>(MODIFY_SUBMIT, {
    method: 'POST',
    data: body,
    ...opt,
  });
};

export async function userWhite(body: { userId: string }, opt?: IObjGet) {
  return request<IResponse<any>>(USER_WHITE, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
}

/**
 * 详情分页
 */
export async function modifyPageInfo(params: ISearch, opt?: IObjGet) {
  return request<IResponse<any>>(PAGE_MODIFY_INFO, {
    method: 'get',
    params,
    ...(opt || {}),
  });
}

/**
 * 详情
 */
export async function modifyDetailInfo(params: { uid: string }, opt?: IObjGet) {
  return request<IResponse<any>>(PAGE_MODIFY_DETAIL, {
    method: 'get',
    params,
    ...(opt || {}),
  });
}

import { IFinance, IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request/request';

const AddBuy = '/api/cbs/sign/buy';
const AddLease = '/api/cbs/sign/lease';
const AddLtc = '/api/cbs/sign/ltc';
const Agreement = '/api/cbs/sign/agreement';
const AgreementCode = '/api/cbs/agreementCode';
const Collect = '/api/cbs/finance';
const Finance = '/api/cbs/sign/finance/finance';
const QueryUsers = '/api/cbs/structure/sign/users';
const AddSignUsers = '/api/cbs/sign/addUsers';

export interface UserData {
  id: number;
  target: string;
  name: string;
  ssn: string;
  phone: string;
}

export interface IAddBuy {
  city: string;
  username: string;
  password: string;
  houseId: string;
  users: UserData[];
  transfer?: string;
  status: number;
  hx: boolean;
}

export async function addSign({
  value,
  options,
}: {
  value: IAddBuy;
  options?: IObjGet;
}) {
  return request<IResponse<any>>(AddBuy, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IAddLease {
  city: string;
  username: string;
  password: string;
  houseId: string;
  amount: number;
}

/**
 * 租赁
 * @param value
 * @param options
 */
export async function addLease(value: IAddLease, options?: IObjGet) {
  return request<IResponse<any>>(AddLease, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

/**
 * 添加限递
 * @param value
 * @param options
 */
export interface ILtcValue {
  city: string;
  username: string;
  password: string;
  houseId: string;
  businessType: '1' | '2';
  start_time?: string;
  end_time?: string;
}

export async function addLtc(value: ILtcValue, options?: IObjGet) {
  return request<IResponse<any>>(AddLtc, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IAddAgreement {
  city: string;
  username: string;
  password: string;
  node: ['create', 'submitAudit', 'approval', 'print', 'sign', 'sort'];
  conId?: string;
  code?: string;
  agreementId?: string;
  chargeObject?: string;
  cusBrokerageReceived?: number;
  ownBrokerageReceived?: number;
  fullname?: string;
  idcardNo?: string;
  phoneNumber?: string;
}

/**
 * 构造协议
 * @param body
 * @param opt
 */
export function addAgreement(body: IAddAgreement, opt?: IObjGet) {
  return request<IResponse<any>>(Agreement, {
    method: 'post',
    data: body,
    ...(opt || {}),
  });
}

/**
 * 协议编码
 * @param opt
 */
export function queryAgreementCode(opt?: IObjGet) {
  return request<IResponse<any>>(AgreementCode, {
    method: 'get',
    ...(opt || {}),
  });
}

export interface ICollect {
  city: string;
  username: string;
  password: string;
  conId: string;
  approve_by: string;
}

/**
 * 签约应收收款
 * @param value
 * @param options
 */
export async function collect(value: ICollect, options?: IObjGet) {
  return request<IResponse<any>>(Collect, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IQueryUsers {
  id: number;
  uid: string;
  target: string;
  name: string;
  ssn: string;
  phone: string;
  creatorName: string;
  creatorId: number;
  create_time: string;
  update_time: string;
}

export async function querySignUsers(options?: IObjGet) {
  return request<IResponse<IQueryUsers[]>>(QueryUsers, {
    method: 'GET',
    ...(options || {}),
  });
}

interface IAddUsers {
  name: string;
  phone: string;
  ssn: string;
}

export async function addSignUsers(data: IAddUsers, options?: IObjGet) {
  return request<IResponse<IQueryUsers[]>>(AddSignUsers, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

export const financeJob = async (data: IFinance, opt?: IObjGet) => {
  return request<IResponse<any>>(Finance, {
    method: 'POST',
    data,
    ...opt,
  });
};

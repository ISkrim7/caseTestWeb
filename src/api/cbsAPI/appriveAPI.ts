import { IFinanceApprove, IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request/request';

const AgreementApprove = '/api/cbs/sign/agreement/approve';
const PerfApprove = '/api/cbs/perfApprove';
const PerfCompanyApprove = '/api/cbs/perfCompanyApprove';
const FinanceApprove = '/api/cbs/sign/finance/approve';
const SignApprove = '/api/cbs/sign/approve';

export const signApprove = (
  body: { conId: string; username: string; city: string; conCode: string },
  opt?: IObjGet,
) => {
  return request<IResponse<any>>(SignApprove, {
    method: 'POST',
    data: body,
    ...(opt || {}),
  });
};

export interface IAgreementApprove {
  username: string;
  password: string;
  city: string;
  agreementId: string;
}

/**
 * 协议审批流
 * @param body IAgreementApprove
 * @param opt
 */
export async function agreementApprove(body: IAgreementApprove, opt?: IObjGet) {
  return request<IResponse<any>>(AgreementApprove, {
    method: 'post',
    data: body,
    ...(opt || {}),
  });
}

export interface IPerfApprove {
  username: string;
  password: string;
  businessType: [1, 2, 3];
  applyNo: string;
}

/**
 * 业绩调整申请
 * @param value
 * @param options
 */
export async function perfApprove(value: IPerfApprove, options?: IObjGet) {
  return request<IResponse<any>>(PerfApprove, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IPerfCompanyApprove {
  username: string;
  password: string;
  conId: string;
  applyId: string;
}

/**
 * 公司平台补业绩审批流
 * @param value
 * @param options
 */
export async function perfCompanyApprove(
  value: IPerfCompanyApprove,
  options?: IObjGet,
) {
  return request<IResponse<any>>(PerfCompanyApprove, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

/**
 * 财务审批
 */

export const financeApprove = async (data: IFinanceApprove, opt?: IObjGet) => {
  return request<IResponse<any>>(FinanceApprove, {
    method: 'POST',
    data,
    ...opt,
  });
};

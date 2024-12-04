import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import { IInterfaceAPI, IInterfaceAPICase } from '@/pages/Interface/types';
import { request } from '@@/plugin-request/request';

/**
 * insertApiCase
 * @param data IInterfaceAPICase
 * @param options
 */
export const insertApiCase = async (
  data: IInterfaceAPICase,
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceAPICase>>(
    '/api/interface/case/insertBaseInfo',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * insertApiCase
 * @param data IInterfaceAPICase
 * @param options
 */
export const setApiCase = async (
  data: IInterfaceAPICase,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * 查询用例信息
 * @param caseId
 * @param opt
 */
export const baseInfoApiCase = async (caseId: string, opt?: IObjGet) => {
  return request<IResponse<IInterfaceAPICase>>('/api/interface/case/baseInfo', {
    method: 'GET',
    params: { id: caseId },
    ...(opt || {}),
  });
};

/**
 * page 用例信息分页
 * @param data
 * @param options
 */
export const pageInterApiCase = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPICase>>>(
    '/api/interface/case/page',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * 添加单个api 给 case
 * @param data
 * @param opt
 */
export const addApi2Case = async (
  data: { caseId: string; apiId: number },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/addOrderApi', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};

/**
 * 获取apis
 * @param data
 * @param opt
 */
export const queryApisByCaseId = async (
  data: string | number,
  opt?: IObjGet,
) => {
  return request<IResponse<IInterfaceAPI[]>>('/api/interface/case/query/apis', {
    method: 'GET',
    params: { caseId: data },
    ...(opt || {}),
  });
};

/**
 * 重新排序
 */
export const reorderApis2Case = async (
  data: { caseId: number | string; apiIds: number[] },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/reorder/apis', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};

/**
 * 删除用例api
 */
export const removeApi2Case = async (
  data: { caseId: number | string; apiId?: number },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/remove/api', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};
/**
 * 执行用例
 */
export const runApiCase = async (data: string | number, opt?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/execute', {
    method: 'POST',
    data: { caseId: data },
    ...(opt || {}),
  });
};

/**
 * 删除用例
 */
export const removeApiCase = async (data: string | number, opt?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/remove', {
    method: 'POST',
    data: { id: data },
    ...(opt || {}),
  });
};

/**
 * 复制用例
 */
export const copyApiCase = async (data: string | number, opt?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/copy', {
    method: 'POST',
    data: { id: data },
    ...(opt || {}),
  });
};

/**
 * 复制用例中api
 */
export const copyApi2Case = async (
  data: { caseId: number | string; apiId: number | string },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/copyApi', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};

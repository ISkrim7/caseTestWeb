import { IObjGet, IPage, IResponse, ISearch } from '@/api';
import {
  IInterfaceAPI,
  IInterfaceAPICase,
  IInterfaceCaseResult,
  IInterfaceResultByCase,
  ITryResponseInfo,
  IVariable,
} from '@/pages/Httpx/types';
import { IUIVars } from '@/pages/Play/componets/uiTypes';
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
 * 选择公共apis 给 case
 * @param data
 * @param opt
 */
export const selectCommonApis2Case = async (
  data: { caseId: number | string; commonApis: number[] },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/selectApis', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};

/**
 * 选择公共apis 给 case
 * @param data
 * @param opt
 */
export const selectCommonApisCopy2Case = async (
  data: { caseId: number | string; commonApis: number[] },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/selectCopyApis', {
    method: 'POST',
    data: data,
    ...(opt || {}),
  });
};

/**
 * 选择公共Group 给 case
 * @param data
 * @param opt
 */
export const selectCommonGroups2Case = async (
  data: { caseId: number | string; groupIds: number[] },
  opt?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/case/selectGroups', {
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
export const runApiCaseIo = async (data: string | number, opt?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/execute/io', {
    method: 'POST',
    data: { caseId: data },
    ...(opt || {}),
  });
};
/**
 * 执行用例
 */
export const runApiCaseBack = async (data: string | number, opt?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/execute/back', {
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

/**
 * 查询case result
 */
export const caseAPIResultDetail = async (data: string, opt?: IObjGet) => {
  return request<IResponse<IInterfaceCaseResult>>(
    `/api/interface/result/case/detail/${data}`,
    {
      method: 'GET',
      ...(opt || {}),
    },
  );
};

/**
 * 删除case result
 */
export const removeCaseAPIResult = async (data: string, opt?: IObjGet) => {
  return request<IResponse<IInterfaceCaseResult>>(
    `/api/interface/result/case/remove`,
    {
      method: 'POST',
      data: { uid: data },
      ...(opt || {}),
    },
  );
};
/**
 * 删除case result
 */
export const removeCaseAPIResults = async (
  data: number | string,
  opt?: IObjGet,
) => {
  return request<IResponse<IInterfaceCaseResult>>(
    `/api/interface/result/case/removeAll`,
    {
      method: 'POST',
      data: { interfaceCaseID: data },
      ...(opt || {}),
    },
  );
};

/**
 * 删除task result
 */
export const removeAllTaskResults = async (
  data: number | string,
  opt?: IObjGet,
) => {
  return request<IResponse<null>>(`/api/interface/result/task/removeAll`, {
    method: 'POST',
    data: { taskId: data },
    ...(opt || {}),
  });
};

/**
 * 查询case result 关联的api result
 */
export const caseAPIResults = async (
  data: {
    interface_case_result_Id: string | number;
  },
  opt?: IObjGet,
) => {
  return request<IResponse<ITryResponseInfo[]>>(
    `/api/interface/result/queryBy`,
    {
      method: 'POST',
      data: data,
      ...(opt || {}),
    },
  );
};

/**
 * 查询case result 关联的api result
 */
export const caseAPIResultsByCase = async (
  data: {
    caseResultId: string | number;
  },
  opt?: IObjGet,
) => {
  return request<IResponse<IInterfaceResultByCase[]>>(
    `/api/interface/result/queryByCaseResultId`,
    {
      method: 'GET',
      params: data,
      ...(opt || {}),
    },
  );
};
/**
 * 查询用例结果分页
 * @param data
 * @param options
 */
export const pageInterCaseResult = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>(
    '/api/interface/result/case/page',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * 查询用例结果分页
 * @param data
 * @param options
 */
export const pageInterApiResult = async (data: ISearch, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceAPI>>>(
    '/api/interface/result/inter/page',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * 修改Vars
 * @param data
 * @param options
 */
export const updateVars = async (data: IVariable, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/vars/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 添加 Vars
 * @param data
 * @param options
 */
export const addVars = async (data: IVariable, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/vars/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * 添加 Vars
 * @param data
 * @param options
 */
export const removeVars = async (data: { uid: string }, options?: IObjGet) => {
  return request<IResponse<null>>('/api/interface/case/vars/remove', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

/**
 * query Vars
 * @param data
 * @param options
 */
export const queryVarsByCaseId = async (data: string, options?: IObjGet) => {
  return request<IResponse<IUIVars[]>>('/api/interface/case/vars/query', {
    method: 'POST',
    data: { case_id: data },
    ...(options || {}),
  });
};

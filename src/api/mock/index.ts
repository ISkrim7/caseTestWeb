//import { request } from '@@/plugin-request';
import type { IObjGet, IPage, IResponse } from '@/api';
//import { request } from 'umi';
import { request } from '@@/plugin-request/request'; // 这个请求实例有全局拦截器
/**
 * Mock规则接口定义
 */
export interface IMockRule {
  id?: string;
  interface_id?: number;
  mockname: string;
  path: string;
  method: string;
  status_code?: number;
  response: {
    code?: number;
    message?: string;
    data?: any;
    [key: string]: any;
  };
  delay?: number;
  enabled: boolean;
  description?: string;
  //headers?: Record<string, string>;
  headers?: Record<string, any>; // 响应头
  request_headers?: Record<string, any>; // 请求头
  cookies?: Record<string, string>;
  script?: string;
  contentType?: string;
  // 新增以下属性
  body_type?: number;
  raw_type?: string;
  params?: Record<string, any>; // 请求参数
  data?: Record<string, any>; // 表单数据
  body?: Record<string, any>; // 原始请求体
}

/**
 * Mock状态接口定义
 */
export interface IMockStatus {
  enabled: boolean;
  totalRequests: number;
  activeRules: number;
  data?: {
    enabled: boolean;
    totalRequests: number;
    activeRules: number;
  };
}

/**
 * 创建Mock规则
 * @param data Mock规则数据
 * @param options 请求配置
 */
export const createMockRule = (data: Partial<IMockRule>, options?: IObjGet) =>
  request<IResponse<IMockRule>>('/api/mock/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });

/**
 * 更新Mock规则
 * @param data Mock规则数据
 * @param options 请求配置
 */
export const updateMockRule = (data: IMockRule, options?: IObjGet) =>
  request<IResponse<IMockRule>>('/api/mock/updateById', {
    method: 'PUT',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data: {
      rule_id: data.id,
      ...data,
    },
    ...(options || {}),
  });

/**
 * 删除Mock规则
 * @param rule_id 规则ID
 * @param options 请求配置
 */
export const deleteMockRule = (rule_id: number, options?: IObjGet) =>
  request<IResponse<void>>('/api/mock/remove', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data: { rule_id },
    ...(options || {}),
  });

/**
 * 批量删除Mock规则
 * @param rule_ids 规则ID数组
 * @param options 请求配置
 */
export const batchDeleteMockRules = (rule_ids: number[], options?: IObjGet) =>
  request<IResponse<void>>('/api/mock/batchRemove', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data: { rule_ids },
    ...(options || {}),
  });

/**
 * 获取Mock规则详情
 * @param path 接口路径
 * @param method 请求方法
 * @param options 请求配置
 */
export const getMockRuleDetail = (
  path: string,
  method: string,
  options?: IObjGet,
) =>
  request<IResponse<IMockRule>>('/api/mock/detail', {
    method: 'GET',
    params: { path, method },
    ...(options || {}),
  });

/**
 * 根据ID获取Mock规则详情
 * @param id 规则ID
 * @param options 请求配置
 */
export const getMockRuleDetailById = (rule_id: number, options?: IObjGet) =>
  request<IResponse<any>>('/api/mock/detail', {
    method: 'GET',
    params: { rule_id },
    ...(options || {}),
  }).then((res: IResponse<any>) => {
    if (res.data) {
      return {
        ...res,
        data: {
          ...res.data,
          status_code: res.data.status_code,
          enable: res.data.enable,
          interface_id: res.data.interface_id,
          content_type: res.data.content_type,
        },
      };
    }
    return res;
  });

/**
 * 分页查询Mock规则
 * @param params 分页参数
 * @param options 请求配置
 */
export const getMockRules = (
  params: { page: number; size: number; userId?: number },
  options?: IObjGet,
) =>
  request<IResponse<IPage<IMockRule>>>('/api/mock/page', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });

/**
 * 根据接口ID获取Mock规则列表
 * @param interfaceId 接口ID
 * @param options 请求配置
 */
export const getMockRulesByInterfaceId = (
  interface_id: number,
  options?: IObjGet,
) =>
  request<IResponse<IMockRule[]>>('/api/mock/list', {
    method: 'GET',
    params: { interface_id },
    ...(options || {}),
  });

/**
 * 获取Mock服务状态
 * @param options 请求配置
 */
export const getMockStatus = (options?: IObjGet) =>
  request<IResponse<IMockStatus>>('/api/mock/status', {
    method: 'GET',
    ...(options || {}),
  });

/**
 * 切换Mock服务状态
 * @param enabled 是否启用
 * 切换Mock服务状态
 * @param enabled 是否启用
 * @param options 请求配置
 */
export const toggleMockService = (enabled: boolean, options?: IObjGet) =>
  request<IResponse<IMockStatus>>('/api/mock/enable', {
    method: 'POST',
    data: { enabled },
    ...(options || {}),
  });

// 在API文件中修改这两个方法，移除数据参数
export const enableMockService = (options?: IObjGet) =>
  request<IResponse<IMockStatus>>('/api/mock/enable', {
    method: 'POST',
    ...(options || {}),
  });

export const disableMockService = (options?: IObjGet) =>
  request<IResponse<IMockStatus>>('/api/mock/disable', {
    method: 'POST',
    ...(options || {}),
  });

/**
 * 切换单个Mock规则状态
 * @param rule_id 规则ID
 * @param enabled 是否启用
 * @param options 请求配置
 */
export const toggleMockRule = (
  rule_id: number,
  enabled: boolean,
  options?: IObjGet,
) =>
  request<IResponse<IMockRule>>('/api/mock/rule/enable', {
    method: 'POST',
    data: { rule_id, enabled },
    ...(options || {}),
  });

/**
 * 导入Mock规则
 */
export const importMockRules = (file: File, options?: IObjGet) => {
  const formData = new FormData();
  formData.append('file', file);
  return request<IResponse<void>>('/api/mock/import', {
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    ...(options || {}),
  });
};

/**
 * 导出Mock规则
 * @param interfaceId 接口ID
 * @param options 请求配置
 */
export const exportMockRules = (interface_id?: string, options?: IObjGet) =>
  request<IResponse<Blob>>('/api/mock/export', {
    method: 'GET',
    params: { interface_id },
    responseType: 'blob',
    ...(options || {}),
  });

/**
 * 关联接口到Mock规则
 * @param data 关联数据
 * @param options 请求配置
 */
export const linkMockToInterface = (
  data: {
    interface_id: string;
    path: string;
    method: string;
  },
  options?: IObjGet,
) =>
  request<IResponse<void>>('/api/mock/link', {
    method: 'POST',
    data: {
      interface_id: data.interface_id,
      path: data.path,
      method: data.method,
    },
    ...(options || {}),
  });

/**
 * 获取所有接口的Mock规则
 * @param options 请求配置
 */
export const getMockInterfaces = (options?: IObjGet) =>
  request<
    IResponse<
      Array<{
        id: string;
        name: string;
        method: string;
        path: string;
        mockCount: number;
        enabledCount: number;
      }>
    >
  >('/api/mock/interfaces', {
    method: 'GET',
    ...(options || {}),
  });

/**
 * Mock API集合
 */
/**
 * 获取Mock配置
 * @param options 请求配置
 */
export const getMockConfig = (options?: IObjGet) =>
  request<
    IResponse<{
      enabled: boolean;
      require_mock_flag: boolean;
      browser_friendly: boolean;
    }>
  >('/api/mock/config', {
    method: 'GET',
    ...(options || {}),
  });

/**
 * 更新Mock配置
 * @param data 配置数据
 * @param options 请求配置
 */
export const updateMockConfig = (
  data: {
    enabled?: boolean;
    require_mock_flag?: boolean;
    browser_friendly?: boolean;
  },
  options?: IObjGet,
) =>
  request<IResponse<void>>('/api/mock/config', {
    method: 'PUT',
    data,
    ...(options || {}),
  });

export const mockApi = {
  create: createMockRule,
  update: updateMockRule,
  delete: deleteMockRule,
  batchDelete: batchDeleteMockRules,
  getDetail: getMockRuleDetail,
  getMockRuleDetailById: getMockRuleDetailById,
  getList: getMockRules,
  getListByInterfaceId: getMockRulesByInterfaceId,
  getStatus: getMockStatus,
  enable: enableMockService,
  disable: disableMockService,
  toggle: toggleMockService,
  toggleRule: toggleMockRule,
  import: importMockRules,
  export: exportMockRules,
  link: linkMockToInterface,
  getInterfaces: getMockInterfaces,
  getConfig: getMockConfig,
  updateConfig: updateMockConfig,
};

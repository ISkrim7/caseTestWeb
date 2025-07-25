// 公共类型定义
export interface IObjGet {
  [key: string]: any;
}

export interface IPage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageInfo?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface IResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 模块导出
export * from './inter';
export * from './mock';
export type { IMockRule } from './mock';

// 默认请求配置
export const DEFAULT_REQUEST_OPTIONS = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

import { IObjGet, IPage, IResponse } from '@/api';
import {
  IInterfaceGlobalFunc,
  IInterfaceGlobalHeader,
  IInterfaceGlobalVariable,
} from '@/pages/Httpx/types';
import { request } from '@@/plugin-request/request';

/**
 * pageInterGlobalVariable
 * @param data
 * @param options
 */
export const pageInterGlobalVariable = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceGlobalVariable>>>(
    '/api/interface/global/page_variable',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * queryInterGlobalVariable
 * @param options
 */
export const queryInterGlobalVariable = async (options?: IObjGet) => {
  return request<IResponse<IInterfaceGlobalVariable[]>>(
    '/api/interface/global/query_variable',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

/**
 * pageInterGlobalHeader
 * @param data
 * @param options
 */
export const pageInterGlobalHeader = async (data: any, options?: IObjGet) => {
  return request<IResponse<IPage<IInterfaceGlobalHeader>>>(
    '/api/interface/global/page_header',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};
/**
 * pageInterGlobalHeader
 * @param options
 */
export const queryInterGlobalFunc = async (options?: IObjGet) => {
  return request<IResponse<IInterfaceGlobalFunc[]>>(
    '/api/interface/global/query_func',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

/**
 * insertInterGlobalHeader
 * @param data
 * @param options
 */
export const insertInterGlobalHeader = async (
  data: IInterfaceGlobalHeader,
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceGlobalHeader>>(
    '/api/interface/global/insert_header',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * insertInterGlobalVariable
 * @param data
 * @param options
 */
export const insertInterGlobalVariable = async (
  data: IInterfaceGlobalVariable,
  options?: IObjGet,
) => {
  return request<IResponse<IInterfaceGlobalHeader>>(
    '/api/interface/global/insert_variable',
    {
      method: 'POST',
      data: data,
      ...(options || {}),
    },
  );
};

/**
 * updateInterGlobalVariable
 * @param data
 * @param options
 */
export const updateInterGlobalVariable = async (
  data: IInterfaceGlobalVariable,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/global/update_variable', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * updateInterGlobalVariable
 * @param data
 * @param options
 */
export const updateInterGlobalHeader = async (
  data: IInterfaceGlobalHeader,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/global/update_header', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

/**
 * removeInterGlobalHeader
 * @param data
 * @param options
 */
export const removeInterGlobalHeader = async (
  data: string,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/global/remove_header', {
    method: 'POST',
    data: { uid: data },
    ...(options || {}),
  });
};

/**
 * removeInterGlobalVariable
 * @param data
 * @param options
 */
export const removeInterGlobalVariable = async (
  data: string,
  options?: IObjGet,
) => {
  return request<IResponse<null>>('/api/interface/global/remove_variable', {
    method: 'POST',
    data: { uid: data },
    ...(options || {}),
  });
};

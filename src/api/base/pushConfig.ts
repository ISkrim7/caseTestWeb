import { IObjGet, IResponse } from '@/api';
import { IPushConfig } from '@/pages/Project/types';
import { request } from '@@/plugin-request';

/**
 * add
 * @param config
 * @param options
 */
export async function insertPushConfig(config: IPushConfig, options?: IObjGet) {
  return request<IResponse<IPushConfig>>('/api/project/push/insertConfig', {
    method: 'POST',
    data: config,
    ...(options || {}),
  });
}

/**
 * update
 * @param config
 * @param options
 */
export async function updatePushConfig(config: IPushConfig, options?: IObjGet) {
  return request<IResponse<IPushConfig>>('/api/project/push/updateConfig', {
    method: 'POST',
    data: config,
    ...(options || {}),
  });
}

/**
 * update
 * @param configId
 * @param options
 */
export async function removePushConfig(configId: number, options?: IObjGet) {
  return request<IResponse<IPushConfig>>('/api/project/push/removeConfig', {
    method: 'POST',
    data: { id: configId },
    ...(options || {}),
  });
}

/**
 * update
 * @param values
 * @param options
 */
export async function pagePushConfig(values: any, options?: IObjGet) {
  return request<IResponse<IPushConfig>>('/api/project/push/pageConfig', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * page
 * @param options
 */
export async function queryPushConfig(options?: IObjGet) {
  return request<IResponse<IPushConfig[]>>('/api/project/push/queryConfig', {
    method: 'GET',
    ...(options || {}),
  });
}

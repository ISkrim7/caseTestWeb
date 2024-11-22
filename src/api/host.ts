import { IHost, IObjGet, IPage, IQueryHost, IResponse, ISearch } from '@/api';
import { request } from '@@/plugin-request/request';

const HostUrl = '/api/interface/host/opt';
const QueryHostUrl = '/api/interface/host/query';

/**
 * host 分页
 * @param params
 * @param options
 */
export async function pageHost(params: ISearch, options?: IObjGet) {
  return request<IResponse<IPage<IHost>>>(HostUrl, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export async function hostOpt(
  method: string,
  params?: IHost,
  options?: IObjGet,
) {
  return request<IResponse<null>>(HostUrl, {
    method,
    data: params,
    ...(options || {}),
  });
}

export async function queryHost(options?: IObjGet) {
  return request<IResponse<IQueryHost[]>>(QueryHostUrl, {
    ...(options || {}),
  });
}

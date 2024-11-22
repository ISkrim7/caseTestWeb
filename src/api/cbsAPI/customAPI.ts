import { IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request/request';

const AddShowing = '/api/cbs/customer/addShowing';
const AddProxy = '/api/cbs/customer/addProxy';

export interface IAddShowing {
  city: string;
  userId: string;
  houseID?: string;
  businessTypeID: string;
}

/**
 * 添加带看
 * @param value
 * @param options
 */
export async function addShowing(value: IAddShowing, options?: IObjGet) {
  return request<IResponse<any>>(AddShowing, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IAddCProxy {
  city: string;
  username: string;
  password: string;
  clientId?: string;
  start_time: string;
  businessType: number;
  end_time: string;
}

/**
 * 添加委托
 * @param value
 * @param options
 */
export async function addCProxy(value: IAddCProxy, options?: IObjGet) {
  return request<IResponse<any>>(AddProxy, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

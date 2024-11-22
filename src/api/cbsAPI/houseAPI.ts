import { IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request/request';

const OperateBuilding = '/api/cbs/structure/building/operate';
const AddKey = '/api/cbs/structure/house/newKey';
const AddProxy = '/api/cbs/structure/house/newProxy';
const AddShoot = '/api/cbs/structure/house/newShoot';
const InsertHouse = '/api/cbs/structure/house/insert';

export interface IOperateBuilding {
  city: string;
  buildingName: string;
  builder: string;
  operate: number;
  assignee?: string;
  signee?: string;
  buildId?: string;
  unitId?: string;
  floorId?: string;
}

/**
 * 楼盘纠错
 * @param value
 * @param options
 */
export async function operateBuilding(
  value: IOperateBuilding,
  options?: IObjGet,
) {
  return request<IResponse<any>>(OperateBuilding, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface AddKeyType {
  city: string;
  username: string;
  houseId: string;
  keyType: string;
  approve: boolean;
  start_time: string;
  end_time: string;
  businessType: string;
}

/**
 * 钥匙协议
 * @param value
 * @param options
 */
export async function addKey(value: AddKeyType, options?: IObjGet) {
  return request<IResponse<any>>(AddKey, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface AddProxyType {
  city: string;
  userId: string;
  houseId: string;
  start_time?: string;
  end_time?: string;
  floor: string;
  area: string;
  price: string;
  approve: boolean;
  businessType: string;
}

/**
 *
 * @param value
 * @param options
 */
export async function addProxy(value: AddProxyType, options?: IObjGet) {
  return request<IResponse<any>>(AddProxy, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface IShoot {
  username: string;
  password: string;
  houseId: string;
  approve: boolean;
  businessType: string;
}

/**
 * 经纪人实勘
 * @param value
 * @param options
 */
export async function addShoot(value: IShoot, options?: IObjGet) {
  return request<IResponse<any>>(AddShoot, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

export interface InsertHouseType {
  city: string;
  username: string;
  builder: string;
  buildingName: string;
  houseOwn: string;
  name: string;
  phone: string;
  businessType: string;
}

/**
 * 添加房源
 * @param value
 * @param options
 */
export async function insertHouse(value: InsertHouseType, options?: IObjGet) {
  return request<IResponse<any>>(InsertHouse, {
    method: 'POST',
    data: value,
    ...(options || {}),
  });
}

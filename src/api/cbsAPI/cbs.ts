import {
  IBuildingList,
  ICityList,
  IObjGet,
  IPage,
  IResponse,
  IStructureConfig,
  IUserList,
} from '@/api';
import { IPerfInspection } from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import { request } from '@@/plugin-request/request';

const PerfSettingUrl = '/api/cbs/perfSetting';
const PagePerfInspection = '/api/cbs/perfInspection/page';
const PerfInspection = '/api/cbs/perfInspection/handel';
const PerfInspectionDetail = '/api/cbs/perfInspection/detail';
const TodayCount = '/api/cbs/structure/today/count';
const YearCount = '/api/cbs/structure/year/sum';
const TotalCount = '/api/cbs/structure/sum';
const MonthCount = '/api/cbs/structure/month/count';
const CollectInfo = '/api/cbs/collect';
const PageCollectInfo = '/api/cbs/page/collect';
const CityList = '/api/cbs/structure/cityList';
const UserConfig = '/api/cbs/structure/userConfig';
const BuildingConfig = '/api/cbs/structure/buildingConfig';
const AddUser = '/api/cbs/structure/addUser';
const ConfigURL = '/api/cbs/structure/configOpt';
const ConfigInfoURL = '/api/cbs/structure/configInfo';
export const getConfig = async (params: { city: string }, opt?: IObjGet) => {
  return request<IResponse<IStructureConfig>>(ConfigInfoURL, {
    method: 'GET',
    params,
    ...opt,
  });
};

export const setConfig = async (body: IStructureConfig, opt?: IObjGet) => {
  return request(ConfigURL, {
    method: 'POST',
    data: body,
    ...opt,
  });
};

export const queryCityList = async (opt?: IObjGet) => {
  return request<IResponse<ICityList[]>>(CityList, {
    method: 'GET',
    ...opt,
  });
};

export const addSimpleUser = async (
  body: { cityId: number; value: string; tag?: number },
  opt?: IObjGet,
) => {
  return request<IResponse<IUserList[]>>(AddUser, {
    method: 'POST',
    data: body,
    ...opt,
  });
};
export const queryUsersByCityId = async (
  params: { cityId: number },
  opt?: IObjGet,
) => {
  return request<IResponse<IUserList[]>>(UserConfig, {
    method: 'GET',
    params,
    ...opt,
  });
};

export const addUsersByCityId = async (
  data: { cityId: number; value: string; tag: number },
  opt?: IObjGet,
) => {
  return request<IResponse<IUserList[]>>(UserConfig, {
    method: 'POST',
    data,
    ...opt,
  });
};

export const delUsersById = async (data: { id: number }, opt?: IObjGet) => {
  return request<IResponse<IUserList[]>>(UserConfig, {
    method: 'DELETE',
    data,
    ...opt,
  });
};

export const delBuildingById = async (data: { id: number }, opt?: IObjGet) => {
  return request<IResponse<null>>(BuildingConfig, {
    method: 'DELETE',
    data,
    ...opt,
  });
};
export const queryBuildingsByCityId = async (
  params: { cityId: number },
  opt?: IObjGet,
) => {
  return request<IResponse<IBuildingList[]>>(BuildingConfig, {
    method: 'GET',
    params,
    ...opt,
  });
};
export const addBuildingByCityId = async (
  data: { cityId: number; value: string },
  opt?: IObjGet,
) => {
  return request<IResponse<IBuildingList[]>>(BuildingConfig, {
    method: 'POST',
    data,
    ...opt,
  });
};

interface IParams {
  city: string;
}

export const handelPerfInspection = async (
  data: { env: string; date: string },
  opt?: IObjGet,
) => {
  return request(PerfInspection, {
    method: 'POST',
    data: data,
    ...opt,
  });
};

export async function getPerfSetting(params: IParams, options?: IObjGet) {
  console.log(params);
  return request<IResponse<[]>>(PerfSettingUrl, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function countInfo(options?: IObjGet) {
  return request<IResponse<any>>(TodayCount, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function countInfoByYear(
  params: { year: string },
  options?: IObjGet,
) {
  return request<IResponse<any>>(YearCount, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function totalCountInfo(options?: IObjGet) {
  return request<IResponse<any>>(TotalCount, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function monthCountInfo(options?: IObjGet) {
  return request<IResponse<any>>(MonthCount, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCollectInfo(options?: IObjGet) {
  return request<IResponse<ICollectInfo[]>>(CollectInfo, {
    method: 'GET',
    ...(options || {}),
  });
}

export interface IAddCollectInfo {
  title: string;
  tag: string;
  desc: string;
  model: string;
  submitter?: string;
  result?: string;
}

export interface ICollectInfo extends IAddCollectInfo {
  id: number;
  uid: string;
  create_time: string;
  update_time?: string;
  result?: string;
}

export async function addCollectInfo(body: IAddCollectInfo, options?: IObjGet) {
  return request<IResponse<any>>(CollectInfo, {
    method: 'post',
    data: body,
    ...(options || {}),
  });
}

export async function delCollectInfo(body: { uid: string }, options?: IObjGet) {
  return request<IResponse<any>>(CollectInfo, {
    method: 'delete',
    data: body,
    ...(options || {}),
  });
}

/**
 * 修改
 * @param body
 * @param options
 */
export async function putCollectInfo(body: IAddCollectInfo, options?: IObjGet) {
  return request<IResponse<any>>(CollectInfo, {
    method: 'put',
    data: body,
    ...(options || {}),
  });
}

/**
 * 分页
 * @param params
 * @param options
 */
export async function pageCollectInfo(params: any, options?: IObjGet) {
  return request<IResponse<IPage<any>>>(PageCollectInfo, {
    method: 'get',
    params: params,
    ...(options || {}),
  });
}

/**
 * 业绩巡检结果
 */
export async function perfInspection(params: any, options?: IObjGet) {
  return request<IResponse<IPage<any>>>(PagePerfInspection, {
    method: 'get',
    params: params,
    ...(options || {}),
  });
}

export async function perfInspectionDetail(
  params: { uid: string },
  opt?: IObjGet,
) {
  return request<IResponse<IPerfInspection>>(PerfInspectionDetail, {
    method: 'get',
    params,
    ...(opt || {}),
  });
}

/**
 * socket test
 * @param options
 */
export const getNs = async (options?: IObjGet) => {
  return request<IResponse<any>>(
    'https://aijia-test.5i5j.com/api/cbs/ws/test',
    // '/api/cbs/ws/test',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
};

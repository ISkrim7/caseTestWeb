import { IObjGet, IPage, IResponse } from '@/api';
import { IDepart, IDepartTag } from '@/pages/User/Depart/depart';
import { request } from '@@/plugin-request';

/**
 * pageDepart
 * @param values
 * @param options
 */
export async function pageDepart(values: any, options?: IObjGet) {
  return request<IResponse<IPage<IDepart>>>('/api/department/page', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * addDepart
 * @param values
 * @param options
 */
export async function addDepart(values: IDepart, options?: IObjGet) {
  return request<IResponse<null>>('/api/department/insert', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * updateDepart
 * @param values
 * @param options
 */
export async function updateDepart(values: IDepart, options?: IObjGet) {
  return request<IResponse<null>>('/api/department/update', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * removeDepart
 * @param values
 * @param options
 */
export async function removeDepart(values: { id: number }, options?: IObjGet) {
  return request<IResponse<null>>('/api/department/remove', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * queryDepart
 * @param options
 */
export async function queryDepart(options?: IObjGet) {
  return request<IResponse<IDepart[]>>('/api/department/query', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * queryDepartTags
 * @param options
 * @param depart_id
 */
export async function queryDepartTags(depart_id: number, options?: IObjGet) {
  return request<IResponse<IDepartTag[]>>('/api/department/queryTags', {
    method: 'GET',
    params: {
      depart_id: depart_id,
    },
    ...(options || {}),
  });
}

/**
 * removeDepartTag
 * @param options
 * @param tag_id
 */
export async function removeDepartTag(tag_id: number, options?: IObjGet) {
  return request<IResponse<null>>('/api/department/removeTag', {
    method: 'POST',
    data: {
      tag_id: tag_id,
    },
    ...(options || {}),
  });
}

/**
 * updateDepartTag
 * @param options
 * @param data
 */
export async function updateDepartTag(
  data: { id: number; tag_name: string },
  options?: IObjGet,
) {
  return request<IResponse<null>>('/api/department/updateTag', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/**
 * addDepartTags
 * @param options
 * @param data
 */
export async function addDepartTags(
  data: { depart_id: number; tag_name: string },
  options?: IObjGet,
) {
  return request<IResponse<null>>('/api/department/addTags', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

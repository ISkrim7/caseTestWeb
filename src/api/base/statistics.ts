import { IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request';

export const fetchWeekData = async (options?: IObjGet) => {
  return request<IResponse<any[]>>('/api/statistics/new/week', {
    method: 'GET',
    ...(options || {}),
  });
};

import { IObjGet, IResponse } from '@/api';
import { request } from '@@/plugin-request';

export const fetchWeekData = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/statistics/new/week', {
    method: 'GET',
    ...(options || {}),
  });
};

export const fetchWeekTaskData = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/statistics/task/week', {
    method: 'GET',
    ...(options || {}),
  });
};

export const fetchCurrentTaskData = async (options?: IObjGet) => {
  return request<IResponse<any>>('/api/statistics/task/today', {
    method: 'GET',
    ...(options || {}),
  });
};

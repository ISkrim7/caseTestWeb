import { IObjGet, IResponse } from '@/api';
import { CocoConfig } from '@/pages/Jacoco/cocoType';
import { request } from '@@/plugin-request/request';
import { Key } from 'react';

const PageCocoConfigURl: string = '/api/jacoco/config';
const GenCocoReportURl: string = '/api/jacoco/report/create';
const PageCocoReportURl: string = '/api/jacoco/report/query';
const MergeCocoReportURl: string = '/api/jacoco/report/merge';
const DownloadCocoReportURl: string = '/api/jacoco/report/download';
const CocoReportDetailURl: string = '/api/jacoco/report/detail';
const QueryModel = '/api/jacoco/module/query';
const PutCocoReport = '/api/jacoco/report/update';

export const putReportField = async (body: any, options?: IObjGet) => {
  return request<IResponse<any>>(PutCocoReport, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};
export const queryModel = async (options?: IObjGet) => {
  return request<IResponse<any>>(QueryModel, {
    method: 'GET',
    ...(options || {}),
  });
};

export const downloadCoCoReport = async (
  params: { id: number },
  options?: IObjGet,
) => {
  return request<any>(DownloadCocoReportURl, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const pageCoCoReport = async (params: any, options?: IObjGet) => {
  return request<IResponse<any>>(PageCocoReportURl, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const mergeCoCoReport = async (
  data: { report_id_list: Key[] },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(MergeCocoReportURl, {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
};

export const pageCocoChart = async (params: any, options?: IObjGet) => {
  return request<IResponse<any>>(`/api/jacoco/chart`, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const cocoChartDetail = async (chartId: number, options?: IObjGet) => {
  return request<IResponse<any>>(`/api/jacoco/chart/detail`, {
    method: 'GET',
    params: { id: chartId },
    ...(options || {}),
  });
};

export const cocoChartGroup = async (env?: string, options?: IObjGet) => {
  return request<IResponse<any>>(`/api/jacoco/summary`, {
    method: 'GET',
    params: { env: env },
    ...(options || {}),
  });
};
export const pageCocoConfig = async (params: any, options?: IObjGet) => {
  return request<IResponse<any>>(PageCocoConfigURl, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
};

export const putCocoConfig = async (body: CocoConfig, options?: IObjGet) => {
  return request<IResponse<any>>(PageCocoConfigURl, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
};
export const delCocoConfig = async (
  body: { uid: string },
  options?: IObjGet,
) => {
  return request<IResponse<any>>(PageCocoConfigURl, {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
};

export const addCocoConfig = async (body: any, options?: IObjGet) => {
  return request<IResponse<any>>(PageCocoConfigURl, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

export const genReport = async (body: { id: number }, options?: IObjGet) => {
  return request<IResponse<any>>(GenCocoReportURl, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
};

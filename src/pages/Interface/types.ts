import { IBaseField, IExtract, IObjGet } from '@/api';
import React from 'react';

export interface IInterfaceAPI extends IBaseField {
  name: string;
  desc: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: string;
  level: string;
  url: string;
  bodyType: number;
  headers: IHeaders[] | [];
  params: IParams[] | [];
  body: any;
  data: any;
  asserts: IAsserts[];
  extracts: IExtracts[];
  project_id: number;
  env_id: number;
  connectTimeout: number;
  responseTimeout: number;
  beforeScript: string;
  afterScript: string;
  beforeParams: IBeforeParams[] | [];
  follow_redirects: boolean;
}

export interface ITryResponseInfo extends IBaseField {
  interfaceID: number;
  interfaceName: string;
  interfaceDesc: string;
  response_txt: string;
  response_status: number;
  response_head: IObjGet;
  request_head: IObjGet;
  startId: number;
  starterName: string;
  useTime: string;
  result?: 'SUCCESS' | 'ERROR';
  extracts: IExtract[];
  asserts: any;
}

interface IBase {
  id: React.Key;
  key?: string;
  value?: string;
  desc?: string;
}

export interface IInterface {
  id: number;
  uid: string;
  title: string;
  projectID: number;
  casePartID: number;
  create_time: string;
  update_time: string;
  creator: number;
  creatorName: string;
  updater: number;
  updaterName: string;
  responseTimeout: number;
  status: string;
  desc: string | undefined;
  level: 'P0' | 'P1' | 'P2';
  steps: ISteps[];
}

export interface ISteps {
  name: string;
  host: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  step: number;
  url: string;
  desc: string | undefined;
  headers: IHeaders[] | [];
  params: IParams[] | [];
  asserts: IAsserts[] | [];
  extracts: IExtracts[] | [];
  beforeParams: IBeforeParams[] | [];
  beforeVariable: IBeforeVariable[] | [];
  beforeFunc: any;
  afterFunc: any;
  bodyType: number;
  body: any;
}

export interface IParams extends IBase {}

export interface IHeaders extends IBase {}

export interface IExtracts extends IBase {
  target?: string;
}

export interface IBeforeParams extends IBase {
  target?: string;
}

export interface IBeforeVariable extends IBase {}

export interface IAsserts {
  asserOpt?: string;
  expect?: any;
  extraOpt?: string;
  extraValue?: string;
  extraValueType?: string;
  result?: string;
  actual?: any;
  desc?: string;
  id: React.Key;
}

export interface ITryResponse {
  name: string;
  desc: string;
  request?: any;
  status: string;
  response: any;
  asserts: IAsserts[] | [];
  extracts: IExtracts[] | [];
  status_code: number;
  useTime: number;
}

export interface InterfaceResponse {
  id: number;
  uid: string;
  interfaceID: number;
  interfaceUid: string;
  interfaceName: string;
  interfaceDesc?: string;
  interfaceLog: string;
  interfaceSteps: number;
  interfaceErrorStep: number;
  starterID: number;
  starterName: string;
  status: string;
  create_time: string;
  update_time: string;
  startTime: string;
  useTime: string;
  resultInfo: ITryResponse[];
}

/**
 * 全局变量
 */

export interface IVariable {
  id: number;
  uid: string;
  key: string;
  value: any;
  desc: string;
  creatorName: string;
  creatorId: number;
  updaterName?: string;
  updaterId?: number;
  projectId: number;
  projectName: string;
  create_time: string;
  update_time: string;
}

export interface IInterfaceTask {
  id: number;
  uid: string;
  title: string;
  switch: boolean;
  desc?: string;
  level: string;
  status: string;
  cron: string;
  interfaceNum: number;
  projectId: number;
  casePartId: number;
  interfaces: number[] | [];
  create_time: string;
  update_time: string;
  creatorName: string;
  creatorId: number;
  updaterName?: string;
  updaterId?: number;
  isSend: boolean;
  sendType?: number;
  sendKey?: string;
}

export interface IInterfaceTaskInterface {
  uid: string;
  interfaceName: string;
  interfaceDesc?: string;
  interfaceStepNum: number;
  creatorId: number;
  creatorName: string;
}

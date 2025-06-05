import { IBaseField, IExtract, IObjGet } from '@/api';
import React from 'react';

export interface IInterfaceGlobalVariable extends IBaseField {
  key: string;
  value: string;
  description: string;
  project_id: number;
}

export interface IInterfaceGlobalHeader extends IBaseField {
  key: string;
  value: string;
  description: string;
  project_id: number;
}

export interface IInterfaceGlobalFunc extends IBaseField {
  label: string;
  value: string;
  description: string;
  demo: string;
}

export interface IInterfaceAPIRecord extends IBaseField {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: IHeaders[] | [];
  params: IParams[] | [];
  body: any;
  data: any;
  bodyType: number;
  response: any;
}

export interface IInterfaceAPI extends IBaseField {
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: string;
  level: string;
  url: string;
  body_type: number;
  headers: IHeaders[] | [];
  params: IParams[] | [];
  body: any;
  raw_type: 'json' | 'text';
  data: any;
  files: any;
  asserts: IAsserts[];
  extracts: IExtracts[];
  project_id: number;
  module_id: number;
  env_id: number;
  connect_timeout: number;
  response_timeout: number;
  before_script: string;
  before_db_id: number;
  before_sql: string;
  before_sql_extracts: { key: string; jP: string; id: any }[];
  after_script: string;
  after_db_id: number;
  after_sql: string;
  after_sql_extracts: { key: string; jP: string; id: any }[];
  before_params: IBeforeParams[] | [];
  follow_redirects: boolean;
  is_common: number;
  enable: boolean;
  is_group: number;
  group_id: number;
}

export interface IInterfaceGroup extends IBaseField {
  name: string;
  description: string;
  api_num: number;
  project_id: number;
  part_id: number;
}

export interface IInterfaceAPICase extends IBaseField {
  title: string;
  desc: string;
  level: string;
  status: string;
  module_id: number;
  apiNum: number;
  project_id: number;
}

export interface IInterfaceAPITask extends IBaseField {
  title: string;
  desc: string;
  level: string;
  cron: string;
  switch: number | boolean;
  status: string;
  total_cases_num: number;
  module_id: number;
  total_apis_num: number;
  project_id: number;
  is_auto: boolean;
  push_id: number;
}

export interface ITryResponseInfo extends IBaseField {
  request_time: string;
  interfaceID: number;
  interfaceGroupId: number;
  interfaceName: string;
  interfaceDesc: string;
  interfaceEnvId: number;
  response_txt: string;
  response_status: number;
  response_head: IObjGet;
  request_head: IObjGet;
  request_method: string;
  startId: number;
  starterName: string;
  useTime: string;
  result?: 'SUCCESS' | 'ERROR';
  extracts: IExtract[];
  asserts: any;
}

export interface IInterfaceCaseResult extends IBaseField {
  interfaceCaseID: number;
  interfaceCaseName: string;
  interfaceCaseUid: string;
  interfaceCaseDesc: string;
  interfaceCaseProjectId: number;
  interfaceCaseModuleId: number;
  starterId: number;
  starterName: string;
  total_num: number;
  useTime: string;
  startTime: string;
  interfaceLog?: string;
  progress: number;
  interface_task_result_Id?: number;
  result?: 'SUCCESS' | 'ERROR';
  status: 'RUNNING' | 'OVER' | 'ERROR';
}

export interface IInterfaceTaskResult extends IBaseField {
  interfaceProjectId: number;
  interfaceModuleId: number;
  startBy: number;
  starterId: number;
  starterName: string;
  totalNumber: number;
  successNumber: number;
  failNumber: number;
  totalUseTime: string;
  start_time: string;
  end_time: string;
  taskId: number;
  taskUid: string;
  taskName: string;
  runDay: string;
  result?: 'SUCCESS' | 'FAIL';
  progress: number;
  status: 'RUNNING' | 'OVER';
}

interface IBase {
  id: React.Key;
  key?: string;
  value?: string;
  desc?: string;
}

export interface IParams extends IBase {}

export interface IFromData extends IBase {
  content_type?: string;
  value_type?: string;
}

export interface IHeaders extends IBase {}

export interface IExtracts extends IBase {
  target?: string;
  extraOpt?: string;
}

export interface IBeforeSQLExtract {
  id: React.Key;
  key?: string;
  value?: string;
}

export interface IAfterSQLExtract {
  id: React.Key;
  key?: string;
  value?: string;
}

export interface IBeforeParams extends IBase {
  target?: string;
}

export interface IAsserts {
  assert_switch: boolean;
  assert_name: string;
  assert_target?: string;
  assert_extract?: string;
  assert_opt?: string;
  assert_value?: any;
  assert_text?: any;
  result?: string;
  actual?: any;
  desc?: string;
  id: React.Key;
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

export interface IInterfaceResultByCase {
  startTime: string;
  groupId: number | null;
  groupName: string;
  groupDesc: string;
  data: ITryResponseInfo[];
  interfaceID: number;
  id: number;
  interfaceGroupId: number;
  interfaceName: string;
  interfaceDesc: string;
  interfaceEnvId: number;
  response_txt: string;
  response_status: number;
  response_head: IObjGet;
  request_head: IObjGet;
  request_method: string;
  request_txt: string;
  startId: number;
  starterName: string;
  useTime: string;
  result?: 'SUCCESS' | 'ERROR';
  extracts: IExtract[];
  asserts: any;
  // SQL执行结果
  before_sql_result?: any[];
  after_sql_result?: any[];

  // 提取变量
  before_vars?: Record<string, any>;
  after_vars?: Record<string, any>;

  // 提取配置
  before_sql_extracts?: Array<{ key: string; jp: string }>;
  after_sql_extracts?: Array<{ key: string; jp: string }>;
}

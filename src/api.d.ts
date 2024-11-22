export interface IObjGet {
  [key: string | number]: any;
}

interface IPageInfo {
  code: number;
  limit: number;
  page: number;
  pages: number;
  total: number;
  msg: string;
}

export interface IResponse<T> {
  code: number;
  data: T;
  msg: string;
}

interface IPage<T> {
  items: T[] | [];
  pageInfo: IPageInfo;
}

export interface ISearch {
  params?: any;
  sort?: any;
}

export interface IUser {
  id?: number;
  uid?: string;
  username?: string;
  isAdmin?: boolean;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  tagName?: string;
  departmentID?: number;
  departmentName?: string;
}

export interface IPassword {
  new_password?: string;
  old_password?: string;
}

export interface IDepartment {
  adminID?: number;
  desc?: string;
  id?: number;
  name: string;
  uid?: string;
  tags?: Array<string>;
}

export interface IMoHuSearchUser {
  target: string;
  value: string;
}

export interface IProject {
  adminID: number;
  adminName: string;
  create_time: string;
  update_time: string;
  id: number;
  uid: string;
  name: string;
  desc?: string | null;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface INewOrUpdateProject {
  uid?: string;
  name: string;
  desc: string | null;
  adminID?: number;
}

export interface IHost {
  id?: number;
  uid?: string;
  name?: string;
  host?: string;
  port?: string;
  creator?: string;
  updater?: string;
}

export interface ICasePart {
  id?: React.Key;
  uid?: string;
  partName: string;
  projectID?: number | string;
  create_time?: string;
  update_time?: string | null;
  parentID?: number;
  children?: ICasePart[];
  isRoot: boolean;
  rootID: number;
}

export interface IParams {
  id?: number;
  key?: string;
  val?: string;
}

export interface IHeaders {
  id?: number;
  key?: string;
  val?: string;
}

export interface IExtract {
  id?: number;
  key?: string;
  target?: string;
  val?: string;
}

export interface IBeforeParams {
  id: number;
  key: string;
  val: any;
}

export interface IAssertList {
  id?: number;
  extraOpt?: 'jsonpath' | 're';
  extraValue?: string;
  assertOpt?: string;
  expect?: any;
}

export interface IInterfaceStep {
  step: number;
  name: string;
  desc?: string | null;
  url: string;
  method: string;
  body?: any;
  beforeParams?: IBeforeParams[] | [];
  params?: IParams[] | [];
  headers?: IHeaders[] | [];
  asserts?: IAssertList[] | [];
  extracts?: IExtract[] | [];
}

export interface IInterface {
  title: string;
  desc: string | null;
  status: string;
  level: string;
  casePartID: number;
  projectID: number;
  steps: IInterfaceStep[] | [];
}

export interface ICaseStepInfo {
  step: number | undefined;
  todo: string;
  exp: string;
}

export interface ICaseInfo {
  id: number;
  uid: string;
  projectID: number;
  casePartID: number;
  case_title: string;
  case_desc: string;
  case_info: ICaseStepInfo[];
  case_mark?: string;
  case_type: 'COMMENT' | 'SMOKE';
  case_level: 'P1' | 'P2' | 'P3' | 'P4';
  creator: number;
  creatorName: string;
  updaterID?: number;
  updaterName?: string;
}

export interface IDepartmentResponse {
  id: number;
  uid: string;
  adminID: number;
  adminName: string;
  name: string;
  desc: string | null;
  create_time: string;
  update_time: string | null;
}

export interface IDepartmentPage {
  items: IDepartmentResponse[];
  pageInfo: IPageInfo;
}

export interface IHostResponse {
  id: number;
  uid: string;
  name: string;
  host: string;
  port: string;
  desc: string | null;
  creatorID: number;
  creatorName: string;
  updaterID: number;
  updaterName: string | null;
  create_time: string;
  update_time: string | null;
}

export interface IQueryPartTree {
  id: number;
  parentID: number | null;
  partName: string;
  projectID: number;
  uid: string;
  create_time: string;
  update_time: string | null;
  children: IQueryPartTree[] | [];
}

export interface IQueryProjectVariable {
  create_time: string;
  update_time: string;
  creator: string;
  updater: string;
  desc: string;
  id: number;
  key: string;
  val: string;
  projectID: number;
  uid: string;
}

export interface IPageHost {
  items: IHostResponse[] | [];
  pageInfo: IPageInfo;
}

export interface IRequest {
  headers: [key: string | any][];
  method: string;
}

export interface IServiceResponse {
  cookie: any[];
  elapsed: string;
  headers: [key: string | any][];
  response: IResponse<any>;
  status_code: number;
}

export interface IVerify {
  actual: any;
  assertOpt: string;
  expect: any;
  extraOpt: string;
  extraValue: string;
  id: number;
  result: boolean;
}

export interface IApiResponseResultInfo {
  request: IRequest;
  response: IResponse<any>;
  step: number;
  verify: IVerify[];
}

export interface IApiResponse {
  id: number;
  interfaceID: number;
  create_time: string;
  update_time: string;
  interfaceName: string;
  interfaceLog: string;
  interfaceSteps: number;
  starterID: number;
  starterName: string;
  status: string;
  uid: string;
  useTime: string;
  resultInfo: IApiResponseResultInfo[];
}

export interface IGroupInterfaceDataSource {
  useTime: string;
  status: 'SUCCESS' | 'ERROR';
  id: number;
  interfaceCreator: string;
  interfaceDesc: string;
  interfaceUid: string;
  interfaceId: number;
  interfaceName: string;
  interfaceSteps: number;
  startTime: string;
  flag: 'RUNNING' | 'DONE';
  uid: string;
}

export interface IGroupInterfacesResult {
  id: number;
  uid: string;
  create_time: string;
  update_time: string;
  end_time: string;
  starterID: number;
  starterName: string;
  status: 'RUNNING' | 'DONE';
  successNumber: number;
  failNumber: number;
  totalNumber: number;
  rateNumber: number;
  totalUseTime: string;
  detail: IApiResponse[];
}

export interface IQueryHost {
  id: number;
  uid: string;
  name: string;
  host: string;
  port: string;
  desc: string;
  create_time: string;
  update_time: string;
  creatorID: number;
  creatorName: string;
  updaterID: number;
  updaterName: string;
}

export interface IUsername {
  id: number;
  value?: string;
  label?: string;
}

export interface IBuildings {
  id: number;
  buildingName?: string;
  builder?: string;
}

export interface IStructureConfig {
  city: string;
  usernames?: IUsername[] | [];
  buildings?: IBuildings[] | [];
}

export interface ICityList {
  id: number;
  label: string;
  value: string;
  use: boolean;
}

export interface IUserList {
  id: number;
  cityId: number;
  label: string;
  value: string;
  desc?: string;
  tag: number;
  create_time: string;
  update_time: string;
}

export interface IBuildingList {
  id: number;
  cityId: number;
  value: string;
  create_time: string;
  update_time: string;
}

//   财务
export interface IFinance {
  type: string;
  conId: string;
  amount: number;
  fundName: string;
  username: string;
  finance_username: string;
  city: string;
  accountHolder?: string;
  bankAccount?: string;
  payer?: string;
  batchId?: string;
}

export interface IFinanceApprove {
  city: string;
  username: string;
  id: string;
  type: string;
}

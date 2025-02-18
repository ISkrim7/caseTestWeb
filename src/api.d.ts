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

interface IBaseField {
  id: number;
  uid: string;
  creator: number;
  creatorName: string;
  updater: number;
  updaterName: string;
  create_time: string;
  update_time: string;
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

export interface IDepartment {
  adminID?: number;
  desc?: string;
  id?: number;
  name: string;
  uid?: string;
  tags?: Array<string>;
}

export interface IEnv extends IBaseField {
  name: string;
  host: string;
  port: string | null;
  project_id: number;
}

export interface IProject {
  chargeId: number;
  chargeName: string;
  creatorId: number;
  creatorName: string;
  create_time: string;
  update_time: string;
  id: number;
  uid: string;
  title: string;
  desc?: string | null;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ICasePart {
  id?: React.Key;
  uid?: string;
  title: string;
  projectID?: number | string;
  create_time?: string;
  update_time?: string | null;
  parentID?: number;
  children?: ICasePart[];
  isRoot: boolean;
  rootID: number;
}

export interface IExtract {
  id?: number;
  key?: string;
  target?: string;
  val?: string;
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

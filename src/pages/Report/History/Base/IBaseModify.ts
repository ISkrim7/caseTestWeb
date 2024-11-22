import { IObjGet } from '@/api';

export interface IModifyInfo {
  uid: string;
  title: string;
  city: string;
  userId: string;
  create_time: string;
  update_time: string;
  beginTime: string;
  endTime: string;
  useTime: string;
  result: boolean;
  status: string;
  module: IObjGet;
  resultInfo: IModifyResultInfo;
}

export interface IModifyResultInfo {
  infoVerify: 'PASS' | 'FAIL';
  unHandleUsers: 'PASS' | 'FAIL';
  taskVerify: 'PASS' | 'FAIL';
  resultInfo: any;
  taskSource: any[];
  detailInfo: IModifyDetailInfo;
}

export interface IModifyDetailInfo {
  autoStatus: number;
  batchNum: string;
  bdirShopGroupStatus: number;
  busId: number;
  busName: string;
  compId: number;
  companyName: string;
  createTime: string;
  handle: string;
  modifyId: number;
  modifyName: string;
  modifyType: string;
  oldDeptNames: string;
  oldPostName: string;
  oldVal: number;
  ownerLeave: number;
  roleName: string;
  status: number;
  transferId: string;
  unHandleUsers: IHandleUser[];
  updateTime: string;
}

export interface IHandleUser {
  leave: number;
  mobile: string;
  modifyId: number;
  userId: number;
  userName: string;
}

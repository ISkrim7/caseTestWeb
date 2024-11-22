export interface IContractCheckList {
  result: boolean;
  contractCode: string;
  contractStatus: string;
  incomeCountCheck?: boolean;
  incomeDetailCheck?: boolean;
  incomeDetailCostCheck?: boolean;
  prorateAmountCheckResult?: boolean;
  prorateCheckResult: boolean;
  prorateLogCheckResult: boolean;
  sumPaidAmount: number;
  sumReceivableAmount: number;
  intentionCheck?: boolean;
  intentionHistoryCheck?: boolean;
  notCollectCheckResult: boolean;
  incomePerfCheckResult: boolean;
}

export interface IPerfInspection {
  uid: string;
  uat: boolean;
  title: string;
  create_time: string;
  update_time: string;
  runDay: string;
  beginTime: string;
  endTime: string;
  useTime: string;
  runner: string;
  result: boolean;
  resultInfo: IPerfResult[] | IPerfUatResult[];
}

export interface IPerfUatResult {
  url: string;
  result: boolean;
  city: string;
  reason?: string;
  desc: string;
}

export interface IPerfResult {
  city: string;
  contractResultInfo: IContractResultInfo[];
  houseResultInfo: IHouseResultInfo;
  result: boolean;
}

export interface IContractResultInfo {
  businessType: number;
  checkList: IContractCheckList[];
  result: boolean;
  total: number;
}

export interface IHouseResultInfo {
  result: boolean;
  resultInfo: IHouseResultDetailInfo[];
}

export interface IHouseResultDetailInfo {
  businessType: number;
  result: boolean;
}

export interface IResult {
  label: string;
  text: string;
  status: 'success' | 'error' | '';
}

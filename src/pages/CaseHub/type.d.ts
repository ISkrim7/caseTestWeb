import React from 'react';

export interface CaseInfo {
  id: number;
  uid: string;
  project_id: number;
  module_id: number;

  requirement_url: string;
  requirement_level: 'P1' | 'P2' | 'P0';
  requirement_name: string;
  is_review: boolean;
  process: '二轮测试' | '一轮测试中' | '待测试' | '完成' | '编写中';

  case_title: string;
  cases: CaseStepInfo[];
  case_number: number;

  creator: number;
  creatorName: string;
  updater: number;
  updaterName: string;
  create_time: string;
  update_time: string;
}

export interface CaseStepInfo {
  id: number;
  uid: string;
  case_step_name: string;
  case_step_level: 'P1' | 'P0' | 'P2' | 'P3';
  case_step_type: 1 | 2;
  case_step_tag: string;
  case_step_setup: string;
  case_step_status: 0 | 1 | 2; // 0:未开始 1:通过 2:失败
  case_step_bugs?: string[] | [] | undefined;
  case_step_mark?: string | undefined;
  case_sub_step?: CaseSubStep[];
}

export interface CaseSubStep {
  id: React.Key;
  do: string;
  exp: string;
}

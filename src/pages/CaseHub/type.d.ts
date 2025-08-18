import React from 'react';

export interface CaseInfo {
  id: number;
  uid: string;
  project_id: number;
  module_id: number;

  requirement_url: string;
  requirement_name: string;
  is_review: boolean;
  status: '二轮测试' | '一轮测试中' | '待测试' | '完成';

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
  case_step_name: string;
  case_step_level: 'P1' | 'P0' | 'P2' | 'P3';
  case_step_type: '冒烟' | '普通';
  case_step_tag: string;
  case_step_setup: string;
  case_step_pass: boolean;
  case_step_bugs: string[];
  case_step_mark: string;
  case_sub_step: CaseSubStep[];
}

export interface CaseSubStep {
  id: React.Key;
  do: string;
  exp: string;
}

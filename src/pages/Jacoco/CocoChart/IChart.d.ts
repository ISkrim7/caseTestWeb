export interface IChart {
  id: number;
  uid: string;
  create_time: string;
  update_time?: string | undefined | null;
  report_id: number;
  report_uid: string;
  report_name?: string | null;
  project_id_list: string;
  report_project_name_list: string;
  status: number; //0统计中 1 统计成功  2 统计失败
  instruction_missed: number;
  instruction_covered: number;
  instructions: number;
  instruction_coverage: string;

  branch_missed: number;
  branch_covered: number;
  branches: number;
  branch_coverage: string;

  line_missed: number;
  line_covered: number;
  lines: number;
  line_coverage: string;

  cxty_missed: number;
  cxty_covered: number;
  cxty: number;
  cxty_coverage: string;

  method_missed: number;
  method_covered: number;
  methods: number;
  method_coverage: string;

  class_missed: number;
  class_covered: number;
  classes: number;
  class_coverage: string;

  version: string;
  module_name: string;
  env: string;
  remarks: string;
  creator: number;
  creatorName: string;
}

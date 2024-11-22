export interface UIMultipleReport {
  id: number;
  uid: string;
  status: string;
  result: string;
  taskId: number;
  taskUid: string;
  taskName: string;
  totalNumber: number;
  successNumber: number;
  failNumber: number;
  rateNumber: number;
  startBy: 1 | 2;
  starterId: number | undefined;
  starterName: string | undefined;
  totalUseTime: string;
  start_time: string;
  end_time: string;
  details: UIMultipleDetailReport[];
  create_time: string;
  update_time: string;
}

export interface UIMultipleDetailReport {
  id: number;
  uid: string;
  create_time: string;
  update_time: string | null;
  ui_case_Id: number;
  ui_case_name: string;
  ui_case_desc: string;
  ui_case_step_num: number;
  ui_case_err_step?: number | null;
  ui_case_err_step_title?: string | null;
  ui_case_err_step_msg?: string | null;
  ui_case_err_step_pic_path?: string | null;
  startTime: string;
  useTime: string;
  endTime: string;
  startId: number;
  starterName: string;
  status: string;
  result: string;
}

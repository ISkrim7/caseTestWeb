export interface CocoConfig {
  id: number;
  uid: string;
  project_name: string;
  baseVersion: string;
  nowVersion: string;
  module_name: string;
  gitUrl: string;
  ip: string;
  agent_port: number;
  ftp_url: string;
  project_name_list: string;
  project_jar_name_list: string;
  wx_key: string;
  module_id: number;
  create_time: string;
  update_time: string;
  creator: number;
  creatorName: string;
  updater: number;
  updaterName: string;
}

export interface CocoReport {
  id: number;
  uid: string;
  report_name: string;
  project_name: string;
  trigger_tag: string;
  baseVersion: string;
  nowVersion: string;
  gitUrl: string;
  ip: string;
  agent_port: number;
  ftp_url: string;
  project_name_list: string;
  project_jar_name_list: string;
  wx_key: string;
  module_id: number;
  create_time: string;
  update_time: string;
  creator: number;
  creatorName: string;
  updater: number;
  updaterName: string;
  reportDirectory: string;
  project_id_list: string;
  report_project_name_list: string;
  status: number; //（0执行中、1执行成功、2执行失败）")
  diff_code_file: string;
  execution_data_file: string;
  classes_directory: string;
  source_directory: string;
  is_send: string; // "是否发送企微（1发送成功，0未发送，2发送失败）")
  remarks: string;
}

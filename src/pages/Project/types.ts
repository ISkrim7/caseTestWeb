import { IBaseField } from '@/api';

export interface IDBConfig extends IBaseField {
  db_name: string;
  db_type: number;
  db_host: string;
  db_port: string;
  db_username: string;
  db_password: string;
  db_database: string;
  project_id: number;
}

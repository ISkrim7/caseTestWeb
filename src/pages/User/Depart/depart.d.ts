export interface IDepart {
  id: number;
  uid: string;
  name: string;
  description: string;
  admin_id: number;
  admin_name: string;
}

export interface IDepartTag {
  id: number;
  tag_name: string;
  depart_id: number;
}

import { IUser } from '@/api';
import { searchUser } from '@/api/base';

interface SearchUser {
  value: number | undefined;
  label: string | undefined;
}

const MohuSearch = async (params: any) => {
  const res: any[] = [];
  let { data } = await searchUser({ username: params.keyWords });
  data.map((item: IUser) => {
    let users = {
      label: item.username,
      value: item.id,
    };
    res.push(users);
  });
  return res;
};

export default MohuSearch;

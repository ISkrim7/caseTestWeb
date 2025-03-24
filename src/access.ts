import { IUser } from '@/api';

export default function (initialState: { currentUser: IUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    isAdmin: currentUser && currentUser.isAdmin,
  };
}

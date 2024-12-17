import { ILoginParams } from '@/api';
import { useCallback, useState } from 'react';

export default function () {
  const [user, setUser] = useState<ILoginParams>();

  const login = useCallback((username: string, password: string) => {
    setUser({
      username: username,
      password: password,
    });
  }, []);

  const logout = useCallback(() => {
    setUser({} as ILoginParams);
  }, []);

  return {
    user,
    login,
    logout,
  };
}

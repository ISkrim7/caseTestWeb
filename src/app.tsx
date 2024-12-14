import { IUser } from '@/api';
import { currentUser } from '@/api/base';
import RightContent from '@/components/RightContent';
import { errorConfig } from '@/requestErrorConfig';
import { getThem } from '@/utils/token';
import { RequestConfig } from '@@/plugin-request/request';
import { PageLoading } from '@ant-design/pro-components';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import { history, RunTimeLayoutConfig } from 'umi';
import defaultSetting from '../config/defaultSetting';

const loginPath = '/userLogin';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: IUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<IUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await currentUser();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSetting,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSetting,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const [coll, setColl] = useState(false);
  const [currentThem, setCurrentThem] = useState<any>();
  console.log('==current_user==', initialState?.currentUser?.username);

  useEffect(() => {
    const them = getThem();
    if (them) {
      setCurrentThem(them);
    }
  }, []);
  return {
    navTheme: currentThem,
    disableContentMargin: true,
    defaultCollapsed: coll,
    onCollapse: (collapsed) => {
      setColl(collapsed);
    },
    breakpoint: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    onPageChange: () => {
      const { location } = history;
      console.log('===onPageChange===', location.pathname);
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return <ConfigProvider>{children}</ConfigProvider>;
    },
    rightContentRender: () => (
      <RightContent
        coll={coll}
        initialState={initialState}
        setInitialState={setInitialState}
      />
    ),
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig,
};

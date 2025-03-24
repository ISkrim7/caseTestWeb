import { IModule, IModuleEnum, IUser } from '@/api';
import { currentUser, queryProject } from '@/api/base';
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
const loopData = (data: IModule[]): IModuleEnum[] => {
  return data.map((item) => {
    if (item.children) {
      return {
        title: item.title,
        value: item.key,
        children: loopData(item.children),
      };
    }
    return { title: item.title, value: item.key };
  });
};
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: IUser;
  loading?: boolean;
  projects?: { label: string; value: number }[];
  fetchUserInfo?: () => Promise<IUser | undefined>;
  refreshProjects?: () => Promise<{ label: string; value: number }[]>; // 添加刷新方法
}> {
  //当前用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await currentUser();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 查询项目（提取为独立函数，便于复用）
  const fetchProjects = async (): Promise<
    { label: string; value: number }[]
  > => {
    console.log('query projects from app');
    try {
      const { code, data } = await queryProject();
      if (code === 0) {
        return data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  };
  const refreshProjects = async () => {
    return await fetchProjects();
  };

  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const [currentUser, projects] = await Promise.all([
      fetchUserInfo(),
      fetchProjects(),
    ]);
    return {
      fetchUserInfo,
      currentUser,
      projects,
      settings: defaultSetting,
    };
  }
  return {
    fetchUserInfo,
    refreshProjects, // 即使未登录也暴露方法
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

import { IUser } from '@/api';
import { currentUser, queryProject } from '@/api/base';
import RightContent from '@/components/RightContent';
import { errorConfig } from '@/requestErrorConfig';
import { RequestConfig } from '@@/plugin-request/request';
import { PageLoading } from '@ant-design/pro-components';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import { useState } from 'react';
import { history, RunTimeLayoutConfig } from 'umi';
import defaultSetting from '../config/defaultSetting';

const loginPath = '/userLogin';
type ThemeType = 'realDark' | 'light';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: IUser;
  loading?: boolean;
  projects?: { label: string; value: number }[];
  fetchUserInfo?: () => Promise<IUser | undefined>;
  refreshProjects?: () => Promise<{ label: string; value: number }[]>; // 添加刷新方法
  theme?: ThemeType; //主题
  setTheme?: (theme: ThemeType) => void; // 新增设置主题方法
}> {
  // 获取主题函数 - 从 localStorage 读取或使用默认值
  const getTheme = () => {
    return localStorage.getItem('theme') || 'light'; // 确保 key 一致
  };
  const setTheme = (theme: string): ThemeType => {
    localStorage.setItem('theme', theme); // 持久化到 localStorage
    return theme as ThemeType;
  };
  //当前用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await currentUser();
      return res.data;
    } catch (error) {
      console.log('===', error);
      history.push(loginPath);
    }
    return undefined;
  };

  // 查询项目（提取为独立函数，便于复用）
  const fetchProjects = async (): Promise<
    { label: string; value: number }[]
  > => {
    try {
      const { code, data } = await queryProject();
      if (code === 0) {
        return data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
      } else if (code === 4000) {
        history.push(loginPath);
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
      theme: getTheme(), // 初始化时从存储读取
      setTheme, // 暴露设置主题方法
      settings: defaultSetting,
    };
  }
  return {
    fetchUserInfo,
    refreshProjects, // 即使未登录也暴露方法
    theme: getTheme(), // 初始化时从存储读取
    setTheme, // 暴露设置主题方法
    settings: defaultSetting,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const [coll, setColl] = useState(false);
  console.log('==current_user==', initialState?.currentUser?.username);
  const currentThem = initialState?.theme || 'light';

  const toggleTheme = () => {
    const newTheme = currentThem === 'light' ? 'realDark' : 'light';
    initialState?.setTheme?.(newTheme);
    setInitialState({
      ...initialState,
      theme: newTheme,
    });
  };

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
        currentTheme={currentThem} // 只传递当前主题值
        toggleTheme={toggleTheme} // 只传递切换函数
      />
    ),
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig,
};

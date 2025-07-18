import { IUser } from '@/api';
import { currentUser, queryProject } from '@/api/base';
import ErrorBoundary from '@/components/ErrorBoundary';
import RightContent from '@/components/RightContent';
import { errorConfig } from '@/requestErrorConfig';
import { RequestConfig } from '@@/plugin-request/request';
import { PageLoading } from '@ant-design/pro-components';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import { useState } from 'react';
import { history, RunTimeLayoutConfig } from 'umi';
import defaultSetting from '../config/defaultSetting';

// 常量定义
const loginPath = '/userLogin';
const THEME_KEY = 'app-theme';
type ThemeType = 'realDark' | 'light';

// 类型定义
interface InitialState {
  settings?: Partial<LayoutSettings>;
  currentUser?: IUser;
  loading?: boolean;
  projects?: { label: string; value: number }[];
  fetchUserInfo?: () => Promise<IUser | undefined>;
  refreshProjects?: () => Promise<{ label: string; value: number }[]>;
  theme?: ThemeType;
  setTheme?: (theme: ThemeType) => void;
}

// 主题相关工具函数
const themeUtils = {
  getTheme: (): ThemeType => {
    return (localStorage.getItem(THEME_KEY) as ThemeType) || 'light';
  },
  setTheme: (theme: ThemeType): void => {
    localStorage.setItem(THEME_KEY, theme);
  },
};

// 数据获取函数
const fetchUserInfo = async (): Promise<IUser | undefined> => {
  try {
    const res = await currentUser();
    return res.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    history.push(loginPath);
    return undefined;
  }
};

const fetchProjects = async (): Promise<{ label: string; value: number }[]> => {
  try {
    const { code, data } = await queryProject();
    if (code === 0) {
      return data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
    }
    if (code === 4000) {
      history.push(loginPath);
    }
    return [];
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return [];
  }
};

export async function getInitialState(): Promise<InitialState> {
  const baseState = {
    fetchUserInfo,
    refreshProjects: fetchProjects,
    theme: themeUtils.getTheme(),
    setTheme: themeUtils.setTheme,
    settings: defaultSetting,
  };

  if (history.location.pathname !== loginPath) {
    const [currentUser, projects] = await Promise.all([
      fetchUserInfo(),
      fetchProjects(),
    ]);

    return {
      ...baseState,
      currentUser,
      projects,
    };
  }

  return baseState;
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  //左侧导航栏默认展开false，true默认关闭
  const [collapsed, setCollapsed] = useState(false);
  const currentTheme = initialState?.theme || 'light';

  const handleToggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'realDark' : 'light';
    initialState?.setTheme?.(newTheme);
    setInitialState((prev) => ({
      ...prev,
      theme: newTheme,
    }));
  };

  const handlePageChange = () => {
    if (!initialState?.currentUser && history.location.pathname !== loginPath) {
      history.push(loginPath);
    }
  };

  return {
    navTheme: currentTheme,
    disableContentMargin: true,
    defaultCollapsed: collapsed,
    onCollapse: setCollapsed,
    breakpoint: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    onPageChange: handlePageChange,
    unAccessible: <div>无访问权限</div>,
    childrenRender: (children) => (
      <ConfigProvider>
        <ErrorBoundary>
          {initialState?.loading ? <PageLoading /> : children}
        </ErrorBoundary>
      </ConfigProvider>
    ),
    rightContentRender: () => (
      <RightContent
        collapsed={collapsed}
        currentTheme={currentTheme}
        toggleTheme={handleToggleTheme}
      />
    ),
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig,
  // ...其他配置...
  // requestInterceptors: [
  //   (url, options) => {
  //     console.log('[Request Interceptor]', url, options.headers);
  //     return { url, options };
  //   }
  // ],
  // responseInterceptors: [
  //   (response) => {
  //     console.log('[Response]', response);
  //     return response;
  //   }
  // ]
};

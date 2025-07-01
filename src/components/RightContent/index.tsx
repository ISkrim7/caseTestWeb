import { history } from '@@/core/history';
import { useModel } from '@@/exports';
import {
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Segmented, Space, Spin } from 'antd';
import { FC } from 'react';

type ThemeType = 'realDark' | 'light';

interface SelfProps {
  collapsed: boolean;
  currentTheme: string;
  toggleTheme: (t: ThemeType) => void;
}

const GlobalHeaderRight: FC<SelfProps> = ({
  collapsed,
  currentTheme,
  toggleTheme,
}) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const loading = (
    <Spin
      size="small"
      style={{
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  );

  if (!initialState) {
    return loading;
  }
  const { currentUser } = initialState;
  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const handleThemeChange = (value: string) => {
    toggleTheme(value as ThemeType);
  };

  const items: MenuProps['items'] = [
    {
      key: 'center',
      icon: <UserOutlined />,
      label: (
        <a
          target="_blank"
          onClick={(e) => {
            history.push('/user/center');
            return;
          }}
        >
          个人中心
        </a>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <a
          target="_blank"
          onClick={() => {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
            history.push('/userLogin');
            return;
          }}
        >
          登出
        </a>
      ),
    },
  ];

  return (
    <Space
      direction={!collapsed ? 'horizontal' : 'vertical'}
      align="baseline"
      // split={<Divider type={collapsed ? 'horizontal' : 'vertical'} />}
      size={'small'}
    >
      <Segmented
        value={currentTheme}
        vertical={collapsed}
        onChange={handleThemeChange}
        size={!collapsed ? 'small' : 'middle'}
        shape="round"
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'realDark', icon: <MoonOutlined /> },
        ]}
      />
      <Dropdown menu={{ items }}>
        <Avatar
          size="small"
          style={{ backgroundColor: '#f56a00' }}
          src={currentUser.avatar}
          alt="avatar"
        >
          {currentUser.username[0]}
        </Avatar>
      </Dropdown>
    </Space>
  );
};

export default GlobalHeaderRight;

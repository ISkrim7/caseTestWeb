import { clearToken } from '@/utils/token';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Spin } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

export type GlobalHeaderRightProps = {
  coll: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ coll }) => {
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
            clearToken();
            history.push('/login');
            return;
          }}
        >
          登出
        </a>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }}>
      <div>
        <Avatar
          size="small"
          style={{ backgroundColor: '#f56a00' }}
          src={currentUser.avatar}
          alt="avatar"
        >
          {currentUser.username[0]}
        </Avatar>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;

import { ILoginParams } from '@/api';
import { login } from '@/api/user';
import { getToken, setToken } from '@/utils/token';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

const Index: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const getCurrentUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: ILoginParams) => {
    const res = await login({ ...values });
    if (res.code === 0) {
      message.success('login success');
      const { token } = res.data;
      if (token && token != getToken()) {
        setToken(token);
      }
      await getCurrentUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return Promise.resolve();
    }
  };

  return (
    <LoginForm
      title="爱家测试平台"
      initialValues={{ autoLogin: true }}
      onFinish={async (values) => {
        await handleSubmit(values as ILoginParams);
      }}
      style={{ marginTop: 100 }}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined />,
        }}
        placeholder="默认邮箱前缀"
        rules={[
          {
            required: true,
            message: 'username cant empty!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        placeholder={'默认邮箱前缀'}
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined />,
        }}
        rules={[
          {
            required: true,
            message: 'password cant empty!',
          },
        ]}
      />
    </LoginForm>
  );
};

export default Index;

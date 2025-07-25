import { ILoginParams } from '@/api';
import { login } from '@/api/base';
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
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: ILoginParams) => {
    const { code, data } = await login({ ...values });
    if (code === 0) {
      message.success('login success');
      if (data && data != getToken()) {
        setToken(data);
      }
      await getCurrentUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');
      if (redirect) {
        history.push(redirect);
      } else {
        // 根据权限跳转到不同默认页面
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo?.isAdmin) {
          history.push('/home');
        } else {
          history.push('/home2');
        }
      }
      return Promise.resolve();
    }
  };

  return (
    <LoginForm
      title="测试平台"
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
        rules={[
          {
            required: true,
            message: 'username cant empty!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
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
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a onClick={() => history.push('/user/register')}>没有账号？立即注册</a>
      </div>
    </LoginForm>
  );
};

export default Index;

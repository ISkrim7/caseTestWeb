import { publicRegister } from '@/api/base';
import { LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio } from 'antd';
import React from 'react';
import { history } from 'umi';

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const response = await publicRegister({
        username: values.username,
        password: values.password,
        gender: values.gender,
        phone: values.phone,
      });

      // 仅处理成功情况
      if (response.code === 0) {
        message.success('注册成功');
        history.push('/userLogin');
        return;
      }

      /* 移除对4000的单独处理，统一在catch中处理 */
    } catch (error: any) {
      // 统一错误处理
      if (error.response?.data?.code === 4000) {
        message.error(error.response.data.msg);
      } else {
        message.error(error.response?.data?.msg || '注册失败');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 100 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户注册</h2>
      <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不匹配!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: '请输入手机号!' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确!' },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="手机号" />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: '请选择性别!' }]}
        >
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={0}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;

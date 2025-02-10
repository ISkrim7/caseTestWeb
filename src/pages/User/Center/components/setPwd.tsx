import { userUpdatePwd } from '@/api/base';
import { clearToken } from '@/utils/token';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { history } from 'umi';

const SetPwd = () => {
  const [form] = Form.useForm();

  const onFinish = async () => {
    await form.validateFields();
    const body = form.getFieldsValue();
    const { code, msg } = await userUpdatePwd(body);
    if (code === 0) {
      message.success(msg);
      clearToken();
      history.push('/login');
      return true;
    }
  };
  return (
    <ProForm<{
      old_password: string;
      new_password: string;
    }>
      form={form}
      title="修改密码"
      autoFocusFirstInput
      onFinish={onFinish}
    >
      <ProFormText.Password
        name="old_password"
        width={'lg'}
        label="旧密码"
        placeholder="input old_password"
        required={true}
      />
      <ProFormText.Password
        name="new_password"
        label="新密码"
        width={'lg'}
        placeholder="input new_password"
        required={true}
      />
    </ProForm>
  );
};

export default SetPwd;

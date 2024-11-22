import { userWhite } from '@/api/cbsAPI/modifyAPI';
import TitleName from '@/components/TitleName';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';

const UserWhite = () => {
  const [form] = Form.useForm<{ userId: string }>();

  const onFinish = async () => {
    const body = await form.validateFields();
    const { code, msg } = await userWhite(body);
    if (code === 0) {
      message.success(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('人员重置')}
      style={{
        borderRadius: '40px',
        marginBottom: '16px',
        marginTop: '16px',
      }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <ProFormText
            name="userId"
            width={'md'}
            label={'目标人员ID'}
            required
            rules={[{ required: true, message: '目标人员ID必填' }]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default UserWhite;

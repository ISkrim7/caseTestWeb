import { handelPerfInspection } from '@/api/cbsAPI/cbs';
import TitleName from '@/components/TitleName';
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';

const Index = () => {
  const [form] = Form.useForm<{ env: string; date: string }>();
  const onFinish = async (values: { env: string; date: string }) => {
    console.log(values);
    const { code, msg } = await handelPerfInspection(values);
    if (code === 0) {
      message.success(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('手动业绩巡检')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <ProFormSelect
            label={'环境'}
            width={'md'}
            name={'env'}
            initialValue={'sso'}
            options={['uat', 'sso']}
            required
          />
          <ProFormDatePicker
            name="date"
            label="日期"
            required
            rules={[{ required: true, message: '请选择日期' }]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;

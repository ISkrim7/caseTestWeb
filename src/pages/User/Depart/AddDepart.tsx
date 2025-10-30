import { searchUser } from '@/api/base';
import { addDepart } from '@/api/base/depart';
import { IDepart } from '@/pages/User/Depart/depart';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { FC } from 'react';

interface Props {
  callback: () => void;
}

const AddDepart: FC<Props> = ({ callback }) => {
  const [form] = Form.useForm<IDepart>();
  const queryUser: any = async (value: any) => {
    const { keyWords } = value;
    const { code, data } = await searchUser({ username: keyWords });
    if (code === 0) {
      return data.map((item) => ({
        label: item.username,
        value: item.id,
      }));
    }
  };

  return (
    <ModalForm<IDepart>
      trigger={
        <Button type={'primary'}>
          <PlusOutlined />
          添加部门
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          form.resetFields();
        },
      }}
      onFinish={async (values: IDepart) => {
        console.log(values);
        const { code, msg } = await addDepart(values);
        if (code === 0) {
          message.success(msg);
          callback();
          form.resetFields();
          return true;
        }
      }}
    >
      <ProFormText
        name={'name'}
        label={'部门名称'}
        required={true}
        rules={[{ required: true, message: '请输入部门名称' }]}
      />
      <ProFormTextArea
        name={'description'}
        label={'部门描述'}
        required={true}
        rules={[{ required: true, message: '请输入部门描述' }]}
      />

      <ProFormSelect
        showSearch
        name={'admin_id'}
        placeholder={'请选择部门管理员'}
        label={'部门管理员'}
        required={true}
        rules={[{ required: true, message: '请选择部门管理员' }]}
        debounceTime={1000}
        request={queryUser}
        onChange={(value, option) => {
          console.log(value, option);
          form.setFieldValue('admin_id', value);
          form.setFieldValue('admin_name', option.title);
        }}
      />
      <ProFormText hidden={true} name={'admin_name'} />
    </ModalForm>
  );
};

export default AddDepart;

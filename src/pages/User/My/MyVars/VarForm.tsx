import { IUserVar } from '@/api';
import { addOrUpdateUserVars } from '@/api/base';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC } from 'react';

interface ISelfProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callBack?: () => void;
}

const VarForm: FC<ISelfProps> = (props) => {
  const { open, setOpen, callBack } = props;
  const [varFrom] = Form.useForm<IUserVar>();
  const onFinish = async () => {
    const value = await varFrom.validateFields();

    const { code, msg } = await addOrUpdateUserVars(value);
    if (code === 0) {
      message.success(msg);
      varFrom.resetFields();
      setOpen(false);
      callBack?.();
    }
  };

  return (
    <div>
      <ModalForm<IUserVar>
        open={open}
        form={varFrom}
        onFinish={onFinish}
        onOpenChange={setOpen}
      >
        <ProFormText
          name={'key'}
          label={'key'}
          required
          rules={[{ required: true, message: 'key必填' }]}
        />
        <ProFormText
          name={'value'}
          label={'value'}
          required
          rules={[{ required: true, message: 'value必填' }]}
        />
        <ProFormTextArea name={'description'} label={'description'} />
      </ModalForm>
    </div>
  );
};

export default VarForm;

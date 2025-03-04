import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Form } from 'antd';
import { FC } from 'react';

interface SelfProps {
  title: string;
  open: boolean;
  onFinish: any;
  setOpen: any;
}

const ModuleModal: FC<SelfProps> = ({ title, open, onFinish, setOpen }) => {
  const [form] = Form.useForm<{ title: string }>();

  return (
    <ModalForm
      open={open}
      onFinish={onFinish}
      form={form}
      title={title}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setOpen(false),
      }}
    >
      <ProFormText
        width="md"
        name="title"
        label="模块名称"
        placeholder="请输入名称"
      />
    </ModalForm>
  );
};

export default ModuleModal;

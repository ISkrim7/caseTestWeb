import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Form } from 'antd';
import { FC } from 'react';

interface SelfProps {
  title: string;
  open: boolean;
  onFinish: any;
  setOpen: any;
}

const NewDirectoryModal: FC<SelfProps> = ({
  title,
  open,
  setOpen,
  onFinish,
}) => {
  const [form] = Form.useForm<{ partName: string }>();
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
        name="partName"
        label="目录名称"
        placeholder="请输入名称"
      />
    </ModalForm>
  );
};

export default NewDirectoryModal;

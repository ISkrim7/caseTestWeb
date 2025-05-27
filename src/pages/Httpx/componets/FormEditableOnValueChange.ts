import { updateInterApiById } from '@/api/inter';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { FormInstance, message } from 'antd';

export const FormEditableOnValueChange = async (
  form: FormInstance<IInterfaceAPI>,
  field: string,
  no_message: boolean = true,
) => {
  const InterfaceId = form.getFieldValue('id');
  // 新增校验：无 ID 时不发送请求
  if (!InterfaceId) {
    console.warn('未找到接口 ID，跳过自动保存');
    return;
  }
  try {
    const fieldValues = await form.validateFields([field]);
    console.log('====', InterfaceId, fieldValues);
    const { code, msg } = await updateInterApiById({
      id: InterfaceId,
      // @ts-ignore
      [field]: fieldValues[field],
    });
    if (code === 0 && no_message) {
      message.success(msg);
    }
  } catch (error) {
    console.error('自动保存失败:', error);
  }
};

export const FormEditableOnValueRemove = async (
  form: FormInstance<IInterfaceAPI>,
  field: string,
  key: any,
) => {
  const InterfaceId = form.getFieldValue('id');
  await form.validateFields([field]);
  // @ts-ignore
  const currentData = form.getFieldValue(field) || [];
  const updatedData = currentData.filter((item: any) => item.id !== key);
  form.setFieldsValue({
    [field]: updatedData,
  });
  const { code, msg } = await updateInterApiById({
    id: InterfaceId,
    // @ts-ignore
    [field]: updatedData,
  });
  if (code === 0) {
    message.success(msg);
  }
};

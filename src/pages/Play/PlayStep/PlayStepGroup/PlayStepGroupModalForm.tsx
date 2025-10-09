import { IModuleEnum } from '@/api';
import { insertPlayGroupSteps } from '@/api/play/playCase';
import { IUIGroupStep } from '@/pages/Play/componets/uiTypes';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentModuleId?: number;
  currentProjectId?: number;
  callBack: () => void;
}

const PlayStepGroupModalForm: FC<SelfProps> = ({
  currentModuleId,
  callBack,
  currentProjectId,
}) => {
  const [form] = Form.useForm<IUIGroupStep>();
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);

  useEffect(() => {
    if (currentProjectId) {
      // 获取模块枚举和环境数据
      fetchModulesEnum(
        currentProjectId,
        ModuleEnum.UI_STEP,
        setModuleEnum,
      ).then();
    }
    if (currentModuleId && currentProjectId) {
      form.setFieldsValue({
        project_id: currentProjectId,
        module_id: currentModuleId,
      });
    }
  }, [currentModuleId, currentModuleId]);

  const onFinish = async (values: any) => {
    const { code } = await insertPlayGroupSteps(values);
    callBack();
    if (code === 0) {
      message.success('添加成功');
      return true;
    }
    return false;
  };
  return (
    <ModalForm<IUIGroupStep>
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加步骤组
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={onFinish}
    >
      <ProFormSelect
        required
        options={projects}
        name="project_id"
        label="所属项目"
        width="md"
        rules={[{ required: true, message: '所属项目必选' }]}
      />
      <ProFormTreeSelect
        required
        name="module_id"
        label="所属模块"
        allowClear
        rules={[{ required: true, message: '所属模块必选' }]}
        fieldProps={{
          treeData: moduleEnum,
          fieldNames: {
            label: 'title',
          },
          filterTreeNode: true,
        }}
        width={'md'}
      />
      <ProFormText
        required
        width="md"
        name="name"
        label="组名"
        placeholder="Please enter a name"
        rules={[{ required: true, message: '请输入组名' }]}
      />

      <ProFormTextArea
        label="描述"
        required
        width="md"
        name="description"
        rules={[{ required: true, message: '请输入描述' }]}
      />
    </ModalForm>
  );
};

export default PlayStepGroupModalForm;

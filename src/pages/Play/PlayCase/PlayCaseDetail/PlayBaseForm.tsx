import { IModuleEnum } from '@/api';
import { IUICase } from '@/pages/Play/componets/uiTypes';
import { CONFIG } from '@/utils/config';
import { useModel } from '@@/exports';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { FC } from 'react';

interface SelfProps {
  setCurrentProjectId: React.Dispatch<React.SetStateAction<number | undefined>>;
  moduleEnum: IModuleEnum[];
}

const PlayBaseForm: FC<SelfProps> = (props) => {
  const { setCurrentProjectId, moduleEnum } = props;
  const [caseForm] = Form.useForm<IUICase>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];

  return (
    <>
      <ProForm.Group>
        <ProFormText
          width={'md'}
          name="title"
          label="用例标题"
          required={true}
          rules={[{ required: true, message: '用例标题必填' }]}
        />
        <ProFormSelect
          name="level"
          label="优先级"
          width={'md'}
          initialValue={'P1'}
          options={API_LEVEL_SELECT}
          required={true}
          rules={[{ required: true, message: '用例优先级必选' }]}
        />
        <ProFormSelect
          name="status"
          label="用例状态"
          initialValue={'DEBUG'}
          width={'md'}
          options={API_STATUS_SELECT}
          required={true}
          rules={[{ required: true, message: '用例状态必须选' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          required
          options={projects}
          name="project_id"
          label="所属项目"
          width={'md'}
          rules={[{ required: true, message: '所属项目必选' }]}
          fieldProps={{
            onChange: (value: number) => {
              setCurrentProjectId(value);
              caseForm.setFieldsValue({ module_id: undefined });
            },
          }}
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
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={'md'}
          name="description"
          label="用例描述"
          required={true}
          rules={[{ required: true, message: '用例描述必填' }]}
        />
      </ProForm.Group>
    </>
  );
};

export default PlayBaseForm;

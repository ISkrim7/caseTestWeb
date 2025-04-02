import { IModuleEnum } from '@/api';
import { CONFIG } from '@/utils/config';
import { useModel } from '@@/exports';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import React, { FC } from 'react';

interface IProps {
  setCurrentProjectId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentModuleId: React.Dispatch<React.SetStateAction<number | undefined>>;
  moduleEnum: IModuleEnum[];
}

const ApiCaseBaseForm: FC<IProps> = (props) => {
  const { setCurrentProjectId, setCurrentModuleId, moduleEnum } = props;
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const { API_STATUS_SELECT, API_LEVEL_SELECT, API_CASE_ERROR_STOP_OPT } =
    CONFIG;
  return (
    <>
      <ProForm.Group>
        <ProFormSelect
          width={'md'}
          options={projects}
          label={'所属项目'}
          name={'project_id'}
          required={true}
          onChange={(value) => {
            setCurrentProjectId(value as number);
          }}
        />
        <ProFormTreeSelect
          required
          name="module_id"
          label="所属模块"
          rules={[{ required: true, message: '所属模块必选' }]}
          fieldProps={{
            treeData: moduleEnum,
            onChange: (value) => {
              setCurrentModuleId(value as number);
            },
            fieldNames: {
              label: 'title',
            },
            filterTreeNode: true,
          }}
          width={'md'}
        />
      </ProForm.Group>
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
        <ProFormTextArea
          width={'md'}
          name="desc"
          label="用例描述"
          required={true}
          rules={[{ required: true, message: '用例描述必填' }]}
        />
        <ProFormSelect
          width={'md'}
          name="error_stop"
          label="错误停止"
          initialValue={0}
          required={true}
          options={API_CASE_ERROR_STOP_OPT}
        />
      </ProForm.Group>
    </>
  );
};

export default ApiCaseBaseForm;

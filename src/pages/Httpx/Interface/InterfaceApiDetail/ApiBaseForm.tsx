import { IModuleEnum } from '@/api';
import { CONFIG } from '@/utils/config';
import { useModel } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import React, { FC } from 'react';

interface IProps {
  addFromCase: boolean;
  addFromGroup: boolean;
  currentMode: number;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<number | undefined>>;
  moduleEnum: IModuleEnum[];
}

const ApiBaseForm: FC<IProps> = (props) => {
  const {
    addFromCase,
    addFromGroup,
    moduleEnum,
    setCurrentProjectId,
    currentMode,
  } = props;
  const { API_LEVEL_SELECT, API_STATUS_SELECT, API_REQUEST_METHOD } = CONFIG;
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];

  return (
    <ProCard hidden={addFromCase || addFromGroup}>
      <ProForm.Group>
        <ProFormSelect
          disabled={currentMode === 1}
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
          disabled={currentMode === 1}
          required
          name="module_id"
          label="所属模块"
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
        <ProFormSelect
          disabled={currentMode === 1}
          name="level"
          label="优先级"
          width={'md'}
          initialValue={'P1'}
          options={API_LEVEL_SELECT}
          required={true}
          rules={[{ required: true, message: '用例优先级必选' }]}
        />
        <ProFormSelect
          disabled={currentMode === 1}
          name="status"
          label="用例状态"
          initialValue={'DEBUG'}
          width={'md'}
          options={API_STATUS_SELECT}
          required={true}
          rules={[{ required: true, message: '用例状态必须选' }]}
        />
      </ProForm.Group>
    </ProCard>
  );
};

export default ApiBaseForm;

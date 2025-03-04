import { IModuleEnum } from '@/api';
import { saveRecord2Api } from '@/api/inter';
import { queryProjects } from '@/components/CommonFunc';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface IAddToApi {
  currentRecordId?: string;
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddToApi: FC<IAddToApi> = ({ currentRecordId, setCloseModal }) => {
  const [f] = Form.useForm();
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [currentProjectId]);

  const submit = async () => {
    const value = f.getFieldsValue(true);
    console.log(value);
    if (currentRecordId) {
      value.recordId = currentRecordId;
      const { code, msg } = await saveRecord2Api(value);
      if (code === 0) {
        console.log(msg);
        message.success(msg);
        setCloseModal(false);
      }
    }
  };
  return (
    <ProCard extra={<Button onClick={submit}>添加</Button>}>
      <ProForm form={f} submitter={false}>
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

        <ProFormText label={'接口名称'} name={'name'} width={'md'} />
      </ProForm>
    </ProCard>
  );
};

export default AddToApi;

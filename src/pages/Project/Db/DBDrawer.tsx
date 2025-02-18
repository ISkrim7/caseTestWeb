import {
  getDBConfig,
  insertDBConfig,
  updateDBConfig,
} from '@/api/base/dbConfig';
import { queryProjects } from '@/components/CommonFunc';
import { IDBConfig } from '@/pages/Project/types';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-form';
import { Button, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface IProps {
  onFinish: () => void;
  currentDBConfigId?: string;
}

const DBForm: FC<IProps> = ({ onFinish, currentDBConfigId }) => {
  const [form] = Form.useForm<IDBConfig>();
  const [currentType, setCurrentType] = useState<number>(1);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [config, setConfig] = useState<IDBConfig>();
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);
  useEffect(() => {
    if (currentDBConfigId) {
      getDBConfig(currentDBConfigId).then(async ({ code, data }) => {
        if (code === 0) {
          form.setFieldsValue(data);
          setConfig(data);
        }
      });
    }
  }, [currentDBConfigId]);

  const save = async () => {
    const values = await form.validateFields();
    console.log(values);
    if (currentDBConfigId) {
      await updateDBConfig({ ...values, uid: currentDBConfigId }).then(
        ({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
            onFinish();
          }
        },
      );
    } else {
      const { code, data, msg } = await insertDBConfig(values);
      if (code === 0) {
        message.success(msg);
        onFinish();
      }
    }
  };
  return (
    <ProCard
      extra={
        <Button type={'primary'} onClick={save}>
          Save
        </Button>
      }
    >
      <ProForm form={form} submitter={false}>
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
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            label={'类型'}
            width={'md'}
            initialValue={currentType}
            name={'db_type'}
            options={[
              { label: 'mysql', value: 1 },
              { label: 'redis', value: 3 },
              { label: 'oracle', value: 2 },
            ]}
            onChange={(value: number) => {
              setCurrentType(value);
            }}
          />
        </ProForm.Group>
        <ProFormText label={'name'} name={'db_name'} required={true} />
        <ProFormText label={'host'} name={'db_host'} required={true} />
        <ProFormText label={'port'} name={'db_port'} required={true} />
        <ProFormText label={'username'} name={'db_username'} required={true} />
        <ProFormText.Password
          label={'password'}
          name={'db_password'}
          required={currentType === 1}
        />
        <ProFormText label={'database'} name={'db_database'} required={true} />
      </ProForm>
    </ProCard>
  );
};

export default DBForm;

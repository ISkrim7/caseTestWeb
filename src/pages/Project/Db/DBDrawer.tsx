import { queryProjects } from '@/components/CommonFunc';
import { ProCard, ProForm } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-form';
import { Form } from 'antd';
import { useEffect, useState } from 'react';

const DBForm = () => {
  const [form] = Form.useForm();
  const [currentType, setCurrentType] = useState();
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();

  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);

  return (
    <ProCard>
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
            name={'db_type'}
            options={[
              { label: 'mysql', value: 1 },
              { label: 'redis', value: 3 },
              { label: 'oracle', value: 2 },
            ]}
            onChange={(value) => {
              console.log(value);
            }}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default DBForm;
